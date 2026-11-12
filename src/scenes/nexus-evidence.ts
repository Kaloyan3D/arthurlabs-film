// Literal excerpts from the retained Phase 3 test and shell captures.
export const nexusEvidence = {
  dsh: ['PASS: aih-controller bridge behavior'],
  shell: ['exit status: 0'],
  native: [
    'test verification::tests::composed_shell_checks_are_never_trusted_pass_evidence ... ok',
    'test result: ok. 63 passed; 0 failed; 0 ignored; 0 measured; 398 filtered out; finished in 0.09s',
  ],
  review: [
    "assert.equal(controller.isReviewClass('codex_review'), true)",
    "assert.equal(controller.isReviewClass('reviewer'), true)",
    "assert.equal(controller.isReviewClass('solver'), false)",
  ],
};
