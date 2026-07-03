"use strict";

/* ═══════════════════════════════════════════════════
   مستحصله - موتور محاسبه
   شش روش اساسی
   ═══════════════════════════════════════════════════ */

const MostahselaEngine = (() => {
  const { ABJAD_ORDER, MOSTAHSELA_MODES } = MostahselaConstants;
  const { toLetterArray } = MostahselaNormalize;
  const { runAllTests, normalizeTestConfig } = MostahselaTestEngine;

  function getNextInSequence(letter, sequence, direction) {
    const index = sequence.indexOf(letter);
    if (index === -1) return null;
    if (direction === 'up') return sequence[(index + 1) % sequence.length];
    return sequence[(index - 1 + sequence.length) % sequence.length];
  }

  function getDirection(mode) {
    if (mode === MOSTAHSELA_MODES.ABJAD_UP || mode === MOSTAHSELA_MODES.CIRCLE_UP) {
      return 'up';
    }
    return 'down';
  }

  function assertLetters(letters) {
    if (!Array.isArray(letters) || letters.length === 0) {
      throw new Error('رشته ورودی مستحصله خالی است.');
    }
  }

  function runAbjadUpDown(letters, rawConfig, mode) {
    assertLetters(letters);
    const config = normalizeTestConfig(rawConfig);
    const sequence = ABJAD_ORDER;
    const direction = getDirection(mode);
    const mostahsalat = [];
    const steps = [];

    mostahsalat.push(letters[0]);
    steps.push({
      type: 'first', original: letters[0], final: letters[0],
      outcome: 'accepted', path: [letters[0]], tests: null,
    });

    for (let i = 1; i < letters.length; i += 1) {
      const original = letters[i];
      const snapshotBefore = [...mostahsalat];
      const originalTest = runAllTests(original, mostahsalat, config);

      if (originalTest.passed) {
        mostahsalat.push(original);
        steps.push({
          type: 'normal', original, final: original, outcome: 'accepted',
          path: [original], tests: originalTest.results, snapshotBefore,
        });
        continue;
      }

      const path = [original];
      let current = original;
      let found = false;
      let lastTests = originalTest.results;

      for (let attempt = 0; attempt < sequence.length; attempt += 1) {
        const next = getNextInSequence(current, sequence, direction);
        if (!next || next === original) break;

        current = next;
        if (!path.includes(current)) path.push(current);
        const test = runAllTests(current, mostahsalat, config);
        lastTests = test.results;

        if (test.passed) {
          mostahsalat.push(current);
          steps.push({
            type: 'changed', original, final: current, outcome: 'changed',
            path, tests: test.results, snapshotBefore,
          });
          found = true;
          break;
        }
      }

      if (!found) {
        steps.push({
          type: 'failed', original, final: null, outcome: 'failed',
          path, tests: lastTests, snapshotBefore,
        });
      }
    }

    return { mostahsalat, steps };
  }

  function runDeletion(letters, rawConfig) {
    assertLetters(letters);
    const config = normalizeTestConfig(rawConfig);
    const mostahsalat = [];
    const steps = [];

    mostahsalat.push(letters[0]);
    steps.push({
      type: 'first', original: letters[0], final: letters[0],
      outcome: 'accepted', tests: null,
    });

    for (let i = 1; i < letters.length; i += 1) {
      const original = letters[i];
      const snapshotBefore = [...mostahsalat];
      const test = runAllTests(original, mostahsalat, config);

      if (test.passed) {
        mostahsalat.push(original);
        steps.push({
          type: 'normal', original, final: original, outcome: 'accepted',
          path: [original], tests: test.results, snapshotBefore,
        });
      } else {
        steps.push({
          type: 'deleted', original, final: null, outcome: 'deleted',
          path: [original], tests: test.results, snapshotBefore,
        });
      }
    }

    return { mostahsalat, steps };
  }

  function runQueue(letters, rawConfig) {
    assertLetters(letters);
    const config = normalizeTestConfig(rawConfig);
    const mostahsalat = [];
    const queue = [];
    const steps = [];

    mostahsalat.push(letters[0]);
    steps.push({
      type: 'first', original: letters[0], final: letters[0],
      outcome: 'accepted', tests: null, source: 'main',
    });

    function drainQueue() {
      let drained = true;
      while (drained) {
        drained = false;
        for (let index = 0; index < queue.length; index += 1) {
          const queuedLetter = queue[index];
          const snapshotBefore = [...mostahsalat];
          const test = runAllTests(queuedLetter, mostahsalat, config);

          if (test.passed) {
            mostahsalat.push(queuedLetter);
            queue.splice(index, 1);
            steps.push({
              type: 'queue-accept', original: queuedLetter, final: queuedLetter,
              outcome: 'accepted', tests: test.results, snapshotBefore, source: 'queue',
            });
            drained = true;
            break;
          }
        }
      }
    }

    for (let i = 1; i < letters.length; i += 1) {
      const original = letters[i];
      const snapshotBefore = [...mostahsalat];
      const test = runAllTests(original, mostahsalat, config);

      if (test.passed) {
        mostahsalat.push(original);
        steps.push({
          type: 'normal', original, final: original, outcome: 'accepted',
          tests: test.results, snapshotBefore, source: 'main',
        });
        drainQueue();
      } else {
        queue.push(original);
        steps.push({
          type: 'queued', original, final: null, outcome: 'queued',
          tests: test.results, snapshotBefore, source: 'main',
        });
        drainQueue();
      }
    }

    drainQueue();
    return { mostahsalat, steps, remainingQueue: [...queue] };
  }

  function runCircle(letters, rawConfig, mode, customCircle) {
    assertLetters(letters);
    const config = normalizeTestConfig(rawConfig);
    const sequence = [...customCircle];
    const direction = getDirection(mode);
    const mostahsalat = [];
    const steps = [];

    if (sequence.length === 0) {
      throw new Error('دایره دلخواه خالی است.');
    }

    if (!sequence.includes(letters[0])) {
      steps.push({
        type: 'out-of-circle', original: letters[0], final: null,
        outcome: 'failed', path: [letters[0]], tests: null,
      });
    } else {
      mostahsalat.push(letters[0]);
      steps.push({
        type: 'first', original: letters[0], final: letters[0],
        outcome: 'accepted', path: [letters[0]], tests: null,
      });
    }

    for (let i = 1; i < letters.length; i += 1) {
      const original = letters[i];
      const snapshotBefore = [...mostahsalat];

      if (!sequence.includes(original)) {
        steps.push({
          type: 'out-of-circle', original, final: null, outcome: 'failed',
          path: [original], tests: null, snapshotBefore,
        });
        continue;
      }

      const originalTest = runAllTests(original, mostahsalat, config);
      if (originalTest.passed) {
        mostahsalat.push(original);
        steps.push({
          type: 'normal', original, final: original, outcome: 'accepted',
          path: [original], tests: originalTest.results, snapshotBefore,
        });
        continue;
      }

      const path = [original];
      let current = original;
      let found = false;
      let lastTests = originalTest.results;

      for (let attempt = 0; attempt < sequence.length; attempt += 1) {
        const next = getNextInSequence(current, sequence, direction);
        if (!next || next === original) break;

        current = next;
        if (!path.includes(current)) path.push(current);
        const test = runAllTests(current, mostahsalat, config);
        lastTests = test.results;

        if (test.passed) {
          mostahsalat.push(current);
          steps.push({
            type: 'changed', original, final: current, outcome: 'changed',
            path, tests: test.results, snapshotBefore,
          });
          found = true;
          break;
        }
      }

      if (!found) {
        steps.push({
          type: 'failed', original, final: null, outcome: 'failed',
          path, tests: lastTests, snapshotBefore,
        });
      }
    }

    return { mostahsalat, steps };
  }

  function summarizeMostahsela(result) {
    const steps = result.steps || [];
    const accepted = steps.filter(
      (step) => step.outcome === 'accepted'
        && step.type !== 'first'
        && step.type !== 'queue-accept',
    ).length;
    const changed = steps.filter((step) => step.outcome === 'changed').length;
    const removed = steps.filter(
      (step) => step.outcome === 'failed' || step.outcome === 'deleted',
    ).length + (result.remainingQueue?.length || 0);

    return { accepted, changed, removed };
  }

  function calculateMostahsela({
    letters,
    config = {},
    mode = MOSTAHSELA_MODES.ABJAD_UP,
    customCircle = [],
  }) {
    const parsedLetters = toLetterArray(letters);
    const parsedCircle = toLetterArray(customCircle);
    const normalizedConfig = normalizeTestConfig(config);

    if (!normalizedConfig.tanaqoz.active
        && !normalizedConfig.hamavai.active
        && !normalizedConfig.takrar.active) {
      throw new Error('حداقل یک آزمون باید فعال باشد.');
    }

    let result;
    if (mode === MOSTAHSELA_MODES.ABJAD_UP || mode === MOSTAHSELA_MODES.ABJAD_DOWN) {
      result = runAbjadUpDown(parsedLetters, normalizedConfig, mode);
    } else if (mode === MOSTAHSELA_MODES.CIRCLE_UP || mode === MOSTAHSELA_MODES.CIRCLE_DOWN) {
      result = runCircle(parsedLetters, normalizedConfig, mode, parsedCircle);
    } else if (mode === MOSTAHSELA_MODES.DELETION) {
      result = runDeletion(parsedLetters, normalizedConfig);
    } else if (mode === MOSTAHSELA_MODES.QUEUE) {
      result = runQueue(parsedLetters, normalizedConfig);
    } else {
      throw new Error(`الگوی مستحصله ناشناخته است: ${mode}`);
    }

    return {
      ...result,
      finalRow: result.mostahsalat.join(' '),
      summary: summarizeMostahsela(result),
      mode,
      config: normalizedConfig,
    };
  }

  return {
    getNextInSequence, getDirection, runAbjadUpDown, runDeletion, runQueue, runCircle,
    summarizeMostahsela, calculateMostahsela
  };
})();
