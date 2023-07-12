export async function post() {
  // Update the payment status in the store
  console.log('this is working')
  const responseBody = JSON.stringify({
    status: true,
  });

  return new Response(responseBody, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

