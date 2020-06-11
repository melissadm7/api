import React, { useState, useEffect } from 'react'
import {Link} from "react-router-dom"
import Field from '../components/forms/Field'
import customersAPI from '../services/customersAPI'
import { toast } from 'react-toastify'

const CustomerPage = ({history, match}) => {

    // props.match.params.id
    var {id = "new" } = match.params

    const [customer, setCustomer] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    })
    
    const [errors, setErrors ] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    })

    const [editing, setEditing] = useState(false) // pour savoir si on édite ou non

    // Récupèrer le customer en fonction de son id
    const fetchCustomer = async id => {
        try{
           const {firstName, lastName, email, company} = await customersAPI.find(id)
           setCustomer({firstName, lastName, email, company})
        }catch(error){
            toast.error("Le client n'a pas pu être chargé")
            history.replace("/customers") 
        }
    }

    useEffect(()=>{
        if(id !== "new"){
            setEditing(true)
            fetchCustomer(id)
        }
    },[id])



    const handleChange = (event) => {
        //const value = event.currentTarget.value 
        //const name = event.currentTarget.name
        const {name, value} = event.currentTarget
        setCustomer({...customer, [name]:value})
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        //console.log(customer)
        try{
            // verifier si on édite ou non
            if(editing){
                await customersAPI.update(id, customer)
                toast.success("Le client a bien été modifié")
            }else{
                await customersAPI.create(customer)
                toast.success("Le client a bien été enregistré")
                history.replace("/customers") // redirection
            }
        }catch({response}){
            //console.log(response)
            const {violations} = response.data
            //console.log(violations)
            if(violations){
                const apiErrors = {}
                violations.forEach(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message
                })
                setErrors(apiErrors)
            }
        }


    }

    return ( 
        <>
            {!editing ? <h1>Création d'un client</h1> : <h1>Modification d'un client</h1>}
            
            <form onSubmit={handleSubmit}>
                <Field 
                    name="lastName"
                    label="Nom de famille"
                    placeholder="Nom de famille du client"
                    value={customer.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                />
                <Field 
                    name="firstName"
                    label="Prénom"
                    placeholder="Prénom du client"
                    value={customer.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                />
                <Field 
                    name="email"
                    label="Adresse E-mail"
                    placeholder="Adresse E-mail du client"
                    type="email"
                    value={customer.email}
                    onChange={handleChange}
                    error={errors.email}
                />
                <Field 
                    name="company"
                    label="Entreprise"
                    placeholder="Entreprise du client"
                    value={customer.company}
                    onChange={handleChange}
                    error={errors.company}
                />
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/customers" className="btn btn-secondary">Retour aux clients</Link>
                </div>
            </form>
        </>
     );
}
 
export default CustomerPage;