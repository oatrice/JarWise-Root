# Implementation Plan - Sub-action Duration Breakdown

## Goal Description
Enhance the `Workflow Summary` to provide a detailed breakdown of time spent on each `sub_action` (e.g., Code Review, Documentation, Roadmap) for the current `active_branch`. This provides better visibility into where time is being spent during the automated workflow.

## Proposed Changes

### [luma_core/metrics_summarizer.py](file:///Users/oatrice/Software-projects/Luma/luma_core/metrics_summarizer.py)
- [MODIFY] `summarize_usage_stats`:
    - Add `branch: Optional[str] = None` parameter.
    - Track `start_ts` and `end_ts` for each `sub_action` while parsing logs.
    - If `branch` is provided, filter events by `event.get("active_branch") == branch`.
    - Return a `sub_actions` dictionary containing `elapsed_ms` for each sub-action.

- [MODIFY] `format_summary_message`:
    - Add a new section: `📊 **Breakdown (Elapsed Time)**`.
    - List each sub-action with its duration in `Xm Ys` format.
    - Ensure "Workflow Duration" reflects the total elapsed time of the branch.

### [luma_core/actions/workflow_actions.py](file:///Users/oatrice/Software-projects/Luma/luma_core/actions/workflow_actions.py)
- [MODIFY] `action_guided_workflow`: Pass `branch=state.active_branch` when summarizing stats.

## Verification Plan

### Automated Tests
- Create `tests/test_sub_action_breakdown.py` to:
    1. Generate mock log entries for a branch with multiple sub-actions.
    2. Verify `summarize_usage_stats` correctly calculates elapsed time per sub-action.
    3. Verify `format_summary_message` contains the breakdown section.

### Manual Verification
1. Run a Luma guided workflow.
2. Check the Telegram notification.
3. It should show:
   ```
   🤖 **AI Usage**
     Calls: ...
     Workflow Duration: ...
   
   ⏱️ **Breakdown (Elapsed)**
     - Auto:Quality/CodeReview: 2m 10s
     - Auto:Quality/Docs: 45s
     - Total: 2m 55s
   ```
