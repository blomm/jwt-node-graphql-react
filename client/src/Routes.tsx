import React from 'react'
import { useHelloQuery } from './generated/graphql'

export const Routes: React.FC = () => {
  //const { loading, data } = useQuery(hello)

  const { data, loading, error } = useHelloQuery({
    variables: {},
  })

  if (error) return <p>Error :-(</p>

  if (loading) return <p>Loading...</p>

  return (
    <>
      <div>{JSON.stringify(data)}</div>
      {/* <ul>
        {data.users.map((d: any) => (
          <li>d.email</li>
        ))}
      </ul> */}
    </>
  )
}
