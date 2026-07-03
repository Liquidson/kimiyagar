
"use strict";

/* ═══════════════════════════════════════════════════
   mostahsela-v2/engine.js — موتور خالص مستحصله جلد دوم
   انتقال ساختاری از mostahsela V2 0.html
   بدون DOM، Storage، Toast یا Navigation
   ═══════════════════════════════════════════════════ */

const MostahselaV2 = (() => {
  const { ABJAD_ORDER, PERSIAN_NORMALIZE, DIACRITICS, DEFAULT_TABLE, MODES } = MostahselaV2Constants;
  const ABJAD_SET = new Set(ABJAD_ORDER);
  const DIACRITICS_SET = new Set(DIACRITICS);

  function normalizeLetters(value) {
    const source = Array.isArray(value) ? value.join('') : String(value ?? '');
    const output = [];
    for (const char of source) {
      if (char === ' ' || char === '\u200c' || char === '\n' || char === '\t') continue;
      if (DIACRITICS_SET.has(char)) continue;
      const normalized = PERSIAN_NORMALIZE[char] || char;
      if (DIACRITICS_SET.has(normalized)) continue;
      if (ABJAD_SET.has(normalized)) output.push(normalized);
    }
    return output;
  }

  function normalizeDepth(value) {
    const depth = Number.parseInt(value, 10);
    if (![1, 2, 3].includes(depth)) throw new Error('عمق تناقض باید ۱، ۲ یا ۳ باشد.');
    return depth;
  }

  function cloneTable(table = DEFAULT_TABLE) {
    const result = {};
    ABJAD_ORDER.forEach((letter) => {
      const row = table[letter] || {};
      result[letter] = {
        1: Array.isArray(row[1]) ? [...row[1]] : [],
        2: Array.isArray(row[2]) ? [...row[2]] : [],
        3: Array.isArray(row[3]) ? [...row[3]] : [],
      };
    });
    return result;
  }

  function validateTable(table) {
    if (!table || typeof table !== 'object') throw new Error('جدول تناقض جلد دوم معتبر نیست.');
    for (const letter of ABJAD_ORDER) {
      const row = table[letter];
      if (!row) throw new Error(`ردیف «${letter}» در جدول تناقض وجود ندارد.`);
      for (const distance of [1, 2, 3]) {
        if (!Array.isArray(row[distance])) throw new Error(`فاصله ${distance} برای «${letter}» معتبر نیست.`);
        if (row[distance].some((item) => !ABJAD_SET.has(item))) {
          throw new Error(`جدول تناقض برای «${letter}» شامل حرف نامعتبر است.`);
        }
      }
    }
    return true;
  }

  function validateCustomCircle(circle) {
    const parsed = normalizeLetters(circle);
    if (parsed.length < 2) throw new Error('دایره دلخواه باید حداقل دو حرف داشته باشد.');
    if (new Set(parsed).size !== parsed.length) throw new Error('دایره دلخواه نباید حرف تکراری داشته باشد.');
    return parsed;
  }

  function evaluateCandidate(candidate, accepted, depth, table = DEFAULT_TABLE) {
    const normalizedDepth = normalizeDepth(depth);
    const conflicts = [];
    for (let distance = 1; distance <= normalizedDepth; distance += 1) {
      const previousIndex = accepted.length - distance;
      if (previousIndex < 0) continue;
      const previousLetter = accepted[previousIndex];
      if (candidate === previousLetter) {
        conflicts.push({ type: 'repetition', distance, candidate, previousLetter });
      }
      const forbidden = (table[candidate] && table[candidate][distance]) || [];
      if (forbidden.includes(previousLetter)) {
        conflicts.push({ type: 'table', distance, candidate, previousLetter });
      }
    }
    return { passed: conflicts.length === 0, conflicts };
  }

  function runDeletion(input, depth, table) {
    const accepted = [];
    const deleted = [];
    const steps = [];
    input.forEach((letter, sourceIndex) => {
      const snapshotBefore = [...accepted];
      const evaluation = evaluateCandidate(letter, accepted, depth, table);
      if (evaluation.passed) {
        accepted.push(letter);
        steps.push({
          sourceIndex, originalLetter: letter, finalLetter: letter,
          action: 'accepted', attempts: [{ candidate: letter, passed: true, conflicts: [] }],
          conflicts: [], snapshotBefore, acceptedSnapshot: [...accepted],
        });
      } else {
        deleted.push(letter);
        steps.push({
          sourceIndex, originalLetter: letter, finalLetter: null,
          action: 'deleted', attempts: [{ candidate: letter, passed: false, conflicts: evaluation.conflicts }],
          conflicts: evaluation.conflicts, snapshotBefore, acceptedSnapshot: [...accepted],
        });
      }
    });
    return { mode: MODES.DELETION, contradictionDepth: depth, accepted, deleted, steps };
  }

  function runQueue(input, depth, table) {
    const accepted = [];
    const queue = [];
    const steps = [];

    function acceptLetter(letter, origin, sourceIndex) {
      const snapshotBefore = [...accepted];
      accepted.push(letter);
      steps.push({
        sourceIndex, originalLetter: letter, finalLetter: letter, origin,
        action: 'accepted', attempts: [{ candidate: letter, passed: true, conflicts: [] }],
        conflicts: [], snapshotBefore, acceptedSnapshot: [...accepted],
        queueSnapshot: queue.map((entry) => entry.letter),
      });
    }

    function drainQueue() {
      let progress = true;
      while (progress) {
        progress = false;
        for (let index = 0; index < queue.length; index += 1) {
          const item = queue[index];
          const evaluation = evaluateCandidate(item.letter, accepted, depth, table);
          if (evaluation.passed) {
            queue.splice(index, 1);
            acceptLetter(item.letter, 'queue', item.sourceIndex);
            progress = true;
            break;
          }
        }
      }
    }

    input.forEach((letter, sourceIndex) => {
      const snapshotBefore = [...accepted];
      const evaluation = evaluateCandidate(letter, accepted, depth, table);
      if (evaluation.passed) {
        acceptLetter(letter, 'input', sourceIndex);
        drainQueue();
      } else {
        queue.push({ letter, sourceIndex, initialConflicts: evaluation.conflicts });
        steps.push({
          sourceIndex, originalLetter: letter, finalLetter: null, origin: 'input',
          action: 'queued', attempts: [{ candidate: letter, passed: false, conflicts: evaluation.conflicts }],
          conflicts: evaluation.conflicts, snapshotBefore, acceptedSnapshot: [...accepted],
          queueSnapshot: queue.map((entry) => entry.letter),
        });
      }
    });
    drainQueue();

    return {
      mode: MODES.QUEUE,
      contradictionDepth: depth,
      accepted,
      remainingQueue: queue.map((entry) => entry.letter),
      steps,
    };
  }

  function runCircle(input, depth, table, circle, direction, mode) {
    const accepted = [];
    const outsideCircle = [];
    const unresolved = [];
    const steps = [];

    input.forEach((originalLetter, sourceIndex) => {
      const snapshotBefore = [...accepted];
      const originalIndex = circle.indexOf(originalLetter);
      if (originalIndex === -1) {
        outsideCircle.push(originalLetter);
        steps.push({
          sourceIndex, originalLetter, finalLetter: null, action: 'outside-circle',
          attempts: [], conflicts: [], snapshotBefore, acceptedSnapshot: [...accepted],
        });
        return;
      }

      const attempts = [];
      let finalLetter = null;
      for (let offset = 0; offset < circle.length; offset += 1) {
        const candidateIndex = direction === 'up'
          ? (originalIndex + offset) % circle.length
          : (originalIndex - offset + circle.length) % circle.length;
        const candidate = circle[candidateIndex];
        const evaluation = evaluateCandidate(candidate, accepted, depth, table);
        attempts.push({ candidate, offset, passed: evaluation.passed, conflicts: evaluation.conflicts });
        if (evaluation.passed) {
          finalLetter = candidate;
          accepted.push(candidate);
          break;
        }
      }

      if (finalLetter === null) unresolved.push(originalLetter);
      const action = finalLetter === null
        ? 'unresolved'
        : (finalLetter === originalLetter ? 'accepted-original' : 'accepted-after-shift');
      steps.push({
        sourceIndex, originalLetter, finalLetter, action, attempts,
        conflicts: attempts.flatMap((attempt) => attempt.conflicts || []),
        snapshotBefore, acceptedSnapshot: [...accepted],
      });
    });

    return { mode, contradictionDepth: depth, accepted, outsideCircle, unresolved, steps };
  }

  function summarize(result) {
    const steps = result.steps || [];
    return {
      accepted: steps.filter((step) => step.action === 'accepted' || step.action === 'accepted-original').length,
      changed: steps.filter((step) => step.action === 'accepted-after-shift').length,
      removed: steps.filter((step) => ['deleted','unresolved','outside-circle'].includes(step.action)).length
        + (result.remainingQueue?.length || 0),
    };
  }

  function calculate({ letters, mode = MODES.ABJAD_UP, depth = 3, customCircle = '', table = DEFAULT_TABLE }) {
    const input = normalizeLetters(letters);
    if (input.length === 0) throw new Error('لطفاً رشته‌ای از حروف معتبر وارد کنید.');
    const normalizedDepth = normalizeDepth(depth);
    validateTable(table);

    let result;
    if (mode === MODES.DELETION) {
      result = runDeletion(input, normalizedDepth, table);
    } else if (mode === MODES.QUEUE) {
      result = runQueue(input, normalizedDepth, table);
    } else if (mode === MODES.ABJAD_UP || mode === MODES.ABJAD_DOWN) {
      result = runCircle(input, normalizedDepth, table, ABJAD_ORDER, mode === MODES.ABJAD_UP ? 'up' : 'down', mode);
    } else if (mode === MODES.CIRCLE_UP || mode === MODES.CIRCLE_DOWN) {
      const circle = validateCustomCircle(customCircle);
      result = runCircle(input, normalizedDepth, table, circle, mode === MODES.CIRCLE_UP ? 'up' : 'down', mode);
    } else {
      throw new Error(`الگوی مستحصله جلد دوم ناشناخته است: ${mode}`);
    }

    return {
      ...result,
      input,
      depth: normalizedDepth,
      finalRow: result.accepted.join(' '),
      summary: summarize(result),
    };
  }

  function runAnchorTest(table = DEFAULT_TABLE) {
    validateTable(table);
    const rejected = evaluateCandidate('ش', ['ج','د','ا'], 3, table);
    const accepted = evaluateCandidate('ت', ['ج','د','ا'], 3, table);
    return { passed: !rejected.passed && accepted.passed, rejected, accepted };
  }

  return {
    ABJAD_ORDER,
    MODES,
    DEFAULT_TABLE,
    normalizeLetters,
    validateCustomCircle,
    validateTable,
    cloneTable,
    evaluateCandidate,
    calculate,
    runAnchorTest,
  };
})();

