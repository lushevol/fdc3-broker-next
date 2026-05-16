/**
 * approval_confirm is a human-interrupt tool.
 * The actual result comes from the user's approval via the UI.
 * This execute is a no-op — the human interrupt flow provides the result.
 */
export async function executeApprovalConfirm(): Promise<{ confirmed: boolean }> {
  // This tool uses interrupt-based approval; execution waits for user interaction.
  return { confirmed: false };
}
