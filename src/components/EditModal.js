import {React, useEffect, useState} from 'react';
import {
    Box,
    Button,
    Typography,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogActions,
    DialogTitle,
    TextField,
    InputLabel
}from '@mui/material';
import { supabase } from '../supabaseClient'

const EditModal = (props) => {

    const [name, setName] = useState(props.name);
    const [about, setAbout] = useState(props.about);
    const [image, setImage] = useState('');
    const [error, setError] = useState();
    const [nameError, setNameError] = useState(false);
    const [aboutError, setAboutError] = useState(false);
    const [uploading, setUploading] = useState(false);

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
                .update([
                    { name: name, about: about, image: filePath }
                ]).eq('id', props.id)
                if(databaseError){
                    throw databaseError
                }
            }
            else{
                const { data, databaseError } = await supabase
                .from('listings')
                .update([
                    { name: name, about: about }
                ]).eq('id', props.id)
                if(databaseError){
                    throw databaseError
                }
            }
        } catch (error) {
          setError(error.message)
          return;
        } finally {
          setUploading(false)
          window.location.reload(false);
        }
      }

    return (
        <Dialog handleClose={props.handleClose} open={props.open}>
        <DialogTitle>Updating listing</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Change anything you feel needs to be changed.
          </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                label="Name"
                fullWidth
                variant="standard"
                required
                onChange={(e) => {
                    setName(e.target.value)
                    setNameError(false);
                }}
                defaultValue={name}
                error={nameError}
            />
            <TextField 
                multiline 
                label="About" 
                variant="standard"
                placeholder="Tell me something about this listing"
                rows={5}
                fullWidth
                required
                onChange={(e) => {
                    setAbout(e.target.value)
                    setAboutError(false);
                }}
                defaultValue={about}
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
            <InputLabel noWrap>*If you don't upload a new picture, the current picture will be used</InputLabel>  
        </DialogContent>
        <DialogActions>
            <Button
                variant="outlined"
                color="error"
                onClick={props.handleClose}
            >
                Exit
            </Button>
            <Button 
                variant="outlined"
                onClick={(e) => handleSubmit(e)} 
                disabled={uploading}
            >
                Update
            </Button>
        </DialogActions>
      </Dialog>
    );

};

export default EditModal;