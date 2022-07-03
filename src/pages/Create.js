import {React, useState } from 'react';
import { supabase } from '../supabaseClient'
import {
    Box,
    Stack,
    Button,
    Typography,
    TextField,
    Alert,
    Snackbar
}from '@mui/material';
import { useNavigate } from "react-router-dom";

const Create = () => {
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const [image, setImage] = useState('');
    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [error, setError] = useState();
    const [nameError, setNameError] = useState(false);
    const [aboutError, setAboutError] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            setUploading(true)
            setNameError(!name)
            setAboutError(!about)
            if(!name || !about){
                throw Error("Missing required fields")
            }

            if(image){
                const file = image;
                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`
                const filePath = `https://fikuqoevthhgcneayuna.supabase.co/storage/v1/object/public/images/${fileName}`

                let { error: uploadError } = await supabase.storage.from('images').upload(fileName, file)
                if (uploadError) {
                    throw uploadError
                }
                const { data, databaseError } = await supabase
                .from('listings')
                .insert([
                    { name: name, about: about, image: filePath }
                ])
                if(databaseError){
                    throw databaseError
                }
            }
            else{
                const { data, databaseError } = await supabase
                .from('listings')
                .insert([
                    { name: name, about: about }
                ])
                if(databaseError){
                    throw databaseError
                }
            }
        } catch (error) {
          setError(error.message)
          return;
        } finally {
          setUploading(false)
        }
        navigate('/')
      }

    return (
    <>
        <form>    
            <Stack
                width="100%"
                height="100%"
                spacing={2}
            >
                <Typography variant="h1" fontSize={"2rem"}>
                    Create a listing
                </Typography>
                <TextField 
                    label="School name" 
                    variant="outlined" 
                    placeholder="Name of your awesome school" 
                    required
                    onChange={(e) => {
                        setName(e.target.value)
                        setNameError(false);
                    }}
                    error={nameError}
                />
                <TextField 
                    multiline 
                    label="About" 
                    variant="outlined"
                    placeholder="Tell me something about this listing"
                    rows={5}
                    required
                    onChange={(e) => {
                        setAbout(e.target.value)
                        setAboutError(false);
                    }}
                    error={aboutError}
                /> 

                <input
                    hidden
                    accept="image/*"
                    id="raised-button-file"
                    type="file"
                    onChange={(e) => {setImage(e.target.files[0])}}
                />
                <label htmlFor="raised-button-file">
                <Button variant="outlined" component="span">
                    Upload
                </Button>
                {image.name}
                </label> 
                <Button 
                    variant="contained" 
                    component="span" 
                    onClick={(e) => handleSubmit(e)}
                    disabled={uploading}
                >
                    {uploading ? "Currently creating submission" : "Submit"}
                </Button>
            </Stack>
        </form>
        <Snackbar open={error} autoHideDuration={6000}>
            <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
        </Snackbar>
    </>
   
    )
}

export default Create;
