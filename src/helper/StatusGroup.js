import Status from "./Status";

const groupOption = [
  {
    label: Status.GROUP_DRAFT_TEXT,
    value: Status.GROUP_DRAFT,
  },
  {
    label: Status.GROUP_NEW_TEXT,
    value: Status.GROUP_NEW,
  },
  {
    label: Status.GROUP_REVIEW_TEXT,
    value: Status.GROUP_REVIEW,
  },
  {
    label: Status.GROUP_PENDING_TEXT,
    value: Status.GROUP_PENDING,
  },
  {
    label: Status.GROUP_APPROVED_TEXT,
    value: Status.GROUP_APPROVED,
  },
  {
    label: Status.GROUP_COMPLETED_TEXT,
    value: Status.GROUP_COMPLETED,
  },
  {
    label: Status.GROUP_CANCELLED_TEXT,
    value: Status.GROUP_CANCELLED,
  },
];

module.exports = groupOption;