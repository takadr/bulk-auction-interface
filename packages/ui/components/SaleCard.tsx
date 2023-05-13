import { chakra, Heading, Card, CardBody, CardFooter, Progress, Text, Image, Stack, Link } from '@chakra-ui/react';
import { MetaData } from '../types/BulksaleV1';

export default function SaleCard({ auction }: { auction: MetaData }){
    return <Link href={`/sales/${auction.id}`}>
    <Card
        direction={{ base: 'column', sm: 'row' }}
        overflow='hidden'
        >
            <Image
            objectFit='cover'
            maxW={{ base: '100%', sm: '200px' }}
            src={auction.logoURL}
            alt={auction.title}
            />
        
            <Stack>
                <CardBody>
                    <Heading size='md'>{auction.title}</Heading>
            
                    <Text py='2'>
                    {auction.description}
                    </Text>
                </CardBody>
            
                <CardFooter>
                    <Progress hasStripe value={(10/auction.finalGoalAmount) * 100} />
                </CardFooter>
            </Stack>
        </Card>
    </Link>
}