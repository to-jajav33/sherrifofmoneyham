export const VALUE_TYPES = {
  FIXED: "FIXED",
  PERCENT: "PERCENT"
};

export default function() {
  return {
    nodes: {
      root: {
        uid: "root",
        parent: null,
        enteredPlannedValue: 2000,
        plannedValue: 2000,
        remainingPlannedValue: 2000,
        actualValue: 0,
        children: [],
        valueType: VALUE_TYPES.FIXED // fixed or percent
      }
    },
    transactions: {}
  };
}
