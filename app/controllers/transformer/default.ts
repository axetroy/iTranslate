export default function(dataList: any[], tableName) {
  const entity = {};
  dataList.forEach(d => {
    entity[(d.tableName || tableName) + d.key] = {
      en: d.value_en,
      cn: d.value_cn,
      tw: d.value_tw,
      __code__: d.code
    };
  });

  return JSON.stringify(entity, null, 2);
}
