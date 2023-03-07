export const postQuery = async(query) => {

    const url = `https://pleasing-stag-47.hasura.app/v1/graphql`;

    const resp = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
        'content-Type': 'application/json',
        'x-hasura-admin-secret': 'zbBHgSPKclNupJYEF3X3IHevWiTQHMRgeOrvyK8cfZ2c6BcdVtwaN3W6tV74DnD9',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(query)
    });
    
    const {data} = await resp.json();
    // console.log(data);
    
    return data;
}