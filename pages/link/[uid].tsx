import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { urlsCollectionRef } from '@/lib/polybase';
import Link from 'next/link';

const LinkPage = () => {
  const router = useRouter()
  const [url, setUrl] = useState<string | null>(null)
  const { uid } = router.query

  useEffect(() => {
    async function getRecord(uid: string) {
      const { data } = await urlsCollectionRef.record(uid).get();
      if (data && data.url) {
        setUrl(data.url)
      }

      if (window && data && data.url) {
        window.location.href = data.url
      }
    }
    if (uid) {
      getRecord(uid as string)
    }
  }, [uid])

  return <p className='p-4 text-lg font-bold'>{!url ? (<>Loading...</>) : <>Redirecting to <Link className='underline hover:no-underline' href={url}>{url}</Link></>}</p>
}

export default LinkPage
