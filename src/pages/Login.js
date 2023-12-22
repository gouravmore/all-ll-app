'use client'
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'
export default function Login() {
  const boxShadowStyle = {
    boxShadow: '-4px 8px 19px -1px',
  };
  const [virtualID, setVirtualID] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (username, password) => {
    try {
      const response = await fetch(
        `https://www.telemetry-dev.theall.ai/v1/vid/generateVirtualID?username=${username}&password=${password}`
      );
      if (response.ok) {
        const data = await response.json();
        const virtualID = data.virtualID;
        console.log('virtual Id', virtualID)
        localStorage.setItem('virtualID', virtualID);
        setVirtualID(virtualID);
        localStorage.setItem(
          'virtualStorySessionID',
          virtualID + '' + Date.now()
        );
        navigate('/discoverylist')
        alert("Successfully Login");
        //history.push('Story');
      } else {
        console.error('Error fetching virtual ID');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <Flex
      className='bg'
      minH={'100vh'}
      align={'center'}
      justify={'center'}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6} width={'600px'}>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <Stack align={'center'}>
            <Heading fontSize={'4xl'} textAlign={'center'}>
              Login
            </Heading>
          </Stack>
          <Stack spacing={4}>
            <FormControl id="uername" isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                className='btn-primary'
                colorScheme='blue'
                onClick={() => handleSubmit(username, password)}
              >
                Login
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>

  )
}