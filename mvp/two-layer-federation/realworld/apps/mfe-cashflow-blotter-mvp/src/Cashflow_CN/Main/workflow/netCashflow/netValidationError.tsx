const netValidationError = (titleMessage: string, data: any) => {
  return {
    title: titleMessage,
    content:
      data.length === 1 ? (
        <div>{data[0]}</div>
      ) : (
        data.map((item: any) => {
          return <div key={`${titleMessage}`}>{item}</div>;
        })
      ),
  };
};

export default netValidationError;
