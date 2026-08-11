export const callAPI = async (query, graphQLClient) => {
  let response;
  try {
    response = await graphQLClient.query(query);
  } catch (error) {
    return 
  }

  if (!response.ok) {
    return;
  }

  let responseData;
  try {
    const jsonData = await response.json();
    responseData = jsonData.data || jsonData;
    return responseData;   
  } catch (error) {
    return;
  }
}
