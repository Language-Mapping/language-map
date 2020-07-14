type MbGroupType = {
  [groupId: string]: {
    name: string
  }
}

export const getGroupNames = (groupObject: MbGroupType): string[] =>
  Object.keys(groupObject).map((groupId: string) => groupObject[groupId].name)
