import fs         from 'fs'
import path       from 'path'
import Web3       from 'web3'
import contractor from 'truffle-contract'
import { Client, Machine } from '../../lib/'
import { token_1, token_2, token_3, token_4, token_5, token_6, token_7 } from './data'

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const tracks = [
  'Qmb9WN3XqP1Ybk9ASZDRd2vq3Nw73oDXMKJP7J4S8t6S3p',
  'Qmb4wKfJv2NuN8DGouMpgYARKZNW5L8YjkofM2iBXrA32U',
  'QmQ4kZpt8VNvQJLEZQcYtU37sfrbAHcdpWtfakbYCYkjeH'
]

const main = async () => {

  const client   = new Client({address: '0x43097addbe46b62eb623d30ef2f892d6ac889d56'})
  // const is = await client.contract.initialize({from: '0x3c7e48216c74d7818ab1fd226e56c60c4d659ba6'})

  const is = await client.contract.hasRole('0x6Ac4fdE190a79f47F528D866E139935Adb9772E5', 'machine', {from: '0x3c7e48216c74d7818ab1fd226e56c60c4d659ba6'})

  console.log(is)
}

main()
