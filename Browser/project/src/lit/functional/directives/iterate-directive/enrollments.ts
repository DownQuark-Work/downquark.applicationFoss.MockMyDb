// @ts-nocheck
// re-enable when api complete so no wasted cycles with updates

/** For use until the following is in place
 * - returns data truncated to 3 enrollments, sorted by `stats.updated_at` in descending order
 * - aggregated counts will have 1 missing value. should be fine for demo purposes
 */
const applyApiStopGap = (origData: KeyValueObjectType): KeyValueObjectType => {
  const mutatedData: KeyValueObjectType = {};
  for (const user in origData) {
    const aggregate = {
      complete: 0,
      in_process: 0,
      unstarted: 0,
      total: 0,
    };
    const [usr, org, ...enrollments] = origData[user],
      enrllmnts = enrollments
        .sort((a, b) => {
          const aggregateKey =
            !b.stats.percentage_completed || b.stats.percentage_completed < 1
              ? "unstarted"
              : b.stats.percentage_completed === 100
              ? "complete"
              : "in_process";
          aggregate[aggregateKey] = aggregate[aggregateKey] + 1;
          aggregate.total = aggregate.total + 1;
          return new Date(a.stats.updated_at).getTime() <
            new Date(b.stats.updated_at).getTime()
            ? 1
            : -1;
        })
        .slice(0, 3);
    mutatedData[user] = [usr, org, aggregate, ...enrllmnts];
  }
  return mutatedData;
};

export const formatOrganizationEnrollments = (orgEnrollments: any) => {
  // console.log('DEBUG: formatting org enrollments: ', {...orgEnrollments})
  const retData: { [k: string]: any[] } = {};
  const includePivot = {};

  // allow O[1] lookups in enrollment loop
  orgEnrollments.included.forEach((include) => {
    const { id: includeId, ...pivotData } = include;
    includePivot[includeId] = pivotData;
  });

  orgEnrollments.data.forEach((datum) => {
    const curUsr = datum.relationships.user.data.id,
      curOrg = includePivot[curUsr].relationships.organization.data.id;

    retData[curUsr] = retData[curUsr] ?? [
      // only need to parse user and org info 1x
      { type: includePivot[curUsr].type, ...includePivot[curUsr].attributes },
      { type: includePivot[curOrg].type, ...includePivot[curOrg].attributes },
    ];

    const { relationships } = datum,
      curCourseId = relationships.course.data.id;
    const curCourse = {
      type: includePivot[curCourseId].type,
      stats: datum.attributes,
      ...includePivot[curCourseId].attributes,
    };
    retData[curUsr].push(curCourse);
  });

  const stopGapData = applyApiStopGap(retData);

  return Object.entries(stopGapData); // Object.entries(retData)
};

export const formatUserEnrollmentResults = (data: any) => {
  // currently unused ... keeping stub until API is fully integrated
  console.log("formatting user results: ", data);
};
