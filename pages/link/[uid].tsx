import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { symmetricDecryptString, urlsCollectionRef } from '@/lib/polybase';
import Link from 'next/link';
import { decodeFromString } from '@polybase/util';
import type { EncryptedDataAesCbc256 } from '@polybase/util';

const LinkPage = () => {
  const router = useRouter()
  const [url, setUrl] = useState<string | null>(null)
  const { uid, key } = router.query

  useEffect(() => {
    // get the record from the database
    async function getRecord(uid: string) {
      const { data } = await urlsCollectionRef.record(uid).get();
      if (data) {
        try {
          const encryptedData: EncryptedDataAesCbc256 = {
            version: 'aes-cbc-256/symmetric',
            nonce: decodeFromString(data.nonce, 'base64'),
            ciphertext: decodeFromString(data.ciphertext, 'base64')
          }
          const decryptedUrl = await symmetricDecryptString(decodeFromString(key as string, 'hex'), encryptedData)
          // console.log(decryptedUrl)
          setUrl(decryptedUrl)

          // redirect to the url
          window.location.href = decryptedUrl
        } catch (error) {
          console.log(error)
        }
      }
    }
    // check if the uid is valid
    if (uid && uid.length > 0 && !Array.isArray(uid)) {
      getRecord(uid)
    }
  }, [uid, key])

  return <p className='p-4 text-lg font-bold'>{!url ? (<>Loading...</>) : <>Redirecting to <Link className='underline hover:no-underline' href={url}>{url}</Link></>}</p>
}

export default LinkPage
