// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { RiMailLine } from 'react-icons/ri'
import './App.css'
import { Button, HStack } from '@chakra-ui/react'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
     <HStack>
      <Button colorScheme={'red'}>Click me</Button>
      <Button colorPalette="teal" variant="solid">
        <RiMailLine /> Email
      </Button>
      <Button >Click me</Button>
    </HStack>
    </>
  )
}

export default App
