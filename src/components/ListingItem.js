import {React, useState } from 'react';

import {
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    CardActions,
    IconButton,
    Typography
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditModal from './EditModal';


const ListingItem = (props) => {
    const DEFAULT_PHOTO = 'https://fikuqoevthhgcneayuna.supabase.co/storage/v1/object/public/images/defaultImage.png'
    const [open, setOpen] = useState(false)

    return(
        <Card sx={{ width: "100%" }}>
            <CardHeader title={props.name}
                action={<IconButton aria-label="settings"
                onClick={() => setOpen(true)}>
                    <MoreVertIcon />
                </IconButton>}
            />
            <CardMedia
                component="img"
                src={props.img ? props.img : DEFAULT_PHOTO}
                width="20%"
                objectFit="cover"
                alt={`Image for ${props.name}`}
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {props.about}
                </Typography>
            </CardContent>
            <EditModal  
                name={props.name} 
                about={props.name} 
                id={props.id}
                open={open}
                handleClose={() => setOpen(false)}
            />
        </Card>
    )
}
export default ListingItem;