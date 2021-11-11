import { RequestParameters, Variables } from 'relay-runtime';

export async function useFetch(operation: RequestParameters, variables: Variables) {
  const response = await fetch('http://localhost:1337/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({ operation, variables })
  });
  if (response.status !== 200) {
    console.error(await response.text());
    throw new Error('Failed to fetch');
  }
  return await response.json();
}
