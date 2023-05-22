import { chakra, Heading, Divider, Card, CardBody, Container } from '@chakra-ui/react';

export const Render500 = ({error}: {error: Error}) => {
    return <Container maxW={'container.md'} py={8}>
    <Card p={8}>
        <CardBody>
            <Heading fontSize={'2xl'}>500 Internal Server Error</Heading>
            <Divider my={4} />
            <chakra.p>
                Please retry later.
            </chakra.p>
        </CardBody>
    </Card>
    </Container>
}

export default Render500;