const MandatoryOnRulesTracer = ({
  newOnChangeObj,
  subSubItem,
  setOnChangeFun,
  isRequiredObj,
  item,
  ruleId,
  set,
  form,
}) => {
  if (!newOnChangeObj[subSubItem.field]) {
    newOnChangeObj[subSubItem.field] = [];
  }
  newOnChangeObj[subSubItem.field].push(
    setOnChangeFun.bind(
      this,
      subSubItem,
      isRequiredObj,
      item.field,
      ruleId,
      set,
      form
    )
  );
  setOnChangeFun(
    subSubItem,
    isRequiredObj,
    item.field,
    ruleId,
    set,
    form,
    form.getFieldValue(subSubItem.field)
  );
};

export default MandatoryOnRulesTracer;
