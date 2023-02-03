import { useState, useEffect } from 'react'

function SigmieSearch(props) {

  const [state, setState] = useState({ hits: [], total: 0, loading: false })

  let search = function () {

    const body = {
      query: props.query,
      per_page: props.perPage,
      filter: props.filter
    }

    fetch(`https://${props.applicationId}.sigmie.app/v1/search/${props.search}d`,
      {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
          'X-Sigmie-API-Key': props.apiKey,
          'X-Sigmie-Application': props.applicationId,
        },
        redirect: 'follow',
        body: JSON.stringify(body)
      }).then((response) => {
        return response.json();
      })
      .then((response) => {

        if (response.error) {
          throw new Error(response.message, { cause: response });
        }

        setState({
          hits: response.hits,
          total: response.total,
          loading: false,
        });
      });
  };

  useEffect(() => {
    const getData = setTimeout(() => {
      search();
    }, props.debounceMs)

    return () => {
      clearTimeout(getData)
    }
  }, [props]);

  return (<div key={state.query}>
    {props.children({ ...state })}
  </div>)
}

SigmieSearch.defaultProps = {
  query: '',
  filter: '',
  debounceMs: 150,
  perPage: 10,
}

export default SigmieSearch;
