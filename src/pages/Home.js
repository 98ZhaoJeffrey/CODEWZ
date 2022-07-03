import {React, useEffect, useState} from 'react';
import {
    Box,
    Button,
    Typography,
    Grid
}from '@mui/material';
import { Link } from "react-router-dom";
import ListingItem from '../components/ListingItem';
import { supabase } from '../supabaseClient';


const Home = () => {
    const [listings, setListings] = useState([]);

    useEffect(() => {
        const getData = async() => {
            const { data, error } = await supabase
            .from('listings')
            .select()
            setListings(data)
        }
        getData();
    }, [])

    return (
        <Box
            width="100%"
            height="100%"
            display='flex'
            flexDirection='column'
            alignItems='center' 
        >
            <Typography variant="h1" fontSize={"2rem"}>
                All school listings
            </Typography>
            <Button variant="contained" component={Link} to="/create">
                Create
            </Button>
            <Box mt="1rem">
                {listings?.length ? 
                    <Grid container spacing={2} columns={16}>
                    {listings.map((listing) => {
                        return (
                            <Grid item xs={16} sm={8} md={4}>
                                <ListingItem
                                    name={listing.name}
                                    img={listing.image}
                                    about={listing.name}
                                    id={listing.id}
                                />
                            </Grid>
                        )    
                    })}      
                    </Grid> :
                    <Typography variant="body1" fontSize={"1rem"}>
                        There is nothing here... yet. Try adding something
                    </Typography>    
                }
            </Box>
        </Box>
    );
}

export default Home;