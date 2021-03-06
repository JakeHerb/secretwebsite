import {
    Button,
    FormControl,
    FormLabel,
    Input,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useToast,
  } from '@chakra-ui/react'
  import { useState } from 'react'
  import { API } from 'aws-amplify'
  import { createContact } from '../graphql/mutations'
  
  export const ContactFormComponent = ({ initialRef, onClose }) => {
    const toast = useToast()
    const [formState, setFormState] = useState({
      email: '',
      affinity: '',
    })
  
    const handleContactFormSubmit = async (e) => {
      e.preventDefault()
      const { email, affinity } = formState
      if (email && affinity) {
        try {
          await API.graphql({
              query: createContact,
              variables: {
                  input: {
                      email, affinity
                  }
              }
          })
  
          toast({
            title: 'Congratulations',
            position: 'top-right',
            description: 'Successfully submitted!',
            status: 'success',
            duration: 5000,
            isClosable: true,
          })
          onClose()
        } catch (e) {
          toast({
            title: 'Error',
            position: 'top-right',
            description: e.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
          })
        }
      } else {
        toast({
          title: 'Uh-Oh 😥',
          position: 'top-right',
          description: 'Please verify all fields are filled out.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    }
  
    return (
      <>
        <ModalHeader>Upload Contact Form</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleContactFormSubmit}>
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Affinity</FormLabel>
              <Input
                ref={initialRef}
                placeholder="Naruto Uzumaki"
                value={formState.affinity}
                onChange={(e) =>
                  setFormState({ ...formState, affinity: e.target.value })
                }
              />
            </FormControl>
  
            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input
                placeholder="yourname@email.com"
                type="email"
                value={formState.email}
                onChange={(e) =>
                  setFormState({ ...formState, email: e.target.value })
                }
              />
            </FormControl>
          </ModalBody>
  
          <ModalFooter>
            <Button colorScheme="blue" mr={3} type="submit">
              Send
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </form>
      </>
    )
  }