import React, { useState, useEffect } from 'react'
import invoicesAPI from '../services/invoicesAPI'
import Field from '../components/forms/Field'
import Select from '../components/forms/Select'
import customersAPI from '../services/customersAPI'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const InvoicePage = ({match, history}) => {

    // props.match.params.id
    var {id = "new" } = match.params

    const [invoice, setInvoice] = useState({
        amount: "",
        customer: "",
        status: "SENT"
    })

    const [customers, setCustomers] = useState([])

    const [errors, setErrors] = useState({
        amount: "",
        customer: "",
        status: ""
    })

    const [editing, setEditing] = useState(false)

    // Récupération des clients
    const fetchCustomers = async () => {
        try{
            const data = await customersAPI.findAll()
            setCustomers(data)
            if(id === "new" ) setInvoice({...invoice, customer: data[0].id})
        }catch(error){
            toast.error("Impossible de charger les clients")
            history.replace("/invoices")
        }
    }

    // récupération des factures 
    const fetchInvoice = async id => {
        try{
           const {amount, status, customer} = await invoicesAPI.find(id)
           setInvoice({amount, status, customer: customer.id})
        }catch(error){
            toast.error("Impossible de charger la facture demandée")
            history.replace("/invoices")
        }
    }

    // récupération de la liste des clients à chaque chargement du composant
    useEffect(()=>{
        fetchCustomers()
    },[])

    // dépend de la variable id - récupération de la bonne facture que l'url change
    useEffect(()=>{
        if(id !=="new"){
            setEditing(true)
            fetchInvoice(id)
        }
    },[id])

    // gestion des changements des inputs dans le formulaire
    const handleChange = (event) => {
        //const value = event.currentTarget.value 
        //const name = event.currentTarget.name
        const {name, value} = event.currentTarget
        setInvoice({...invoice, [name]:value})
    }

    // gestion de la soumission du formulaire
    const handleSubmit = async (event) => {
        event.preventDefault()
        //console.log(invoice)
        try{
            // test si on est en modification ou non
            if(editing){
                await invoicesAPI.update(id, invoice)
                toast.success("La facture a bien été modifiée")
            }else{
                await invoicesAPI.create(invoice)
                toast.success("La facture a bien été enregistrée")
                history.replace("/invoices")
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
            toast.error("Une erreur est survenue")
        }
    }

    return ( 
        <>
            {editing ? <h1>Modification d'une facture</h1> : <h1>Création d'une facture</h1>}
            <form onSubmit={handleSubmit}>
                <Field
                    name="amount"
                    type="number"
                    placeholder="Montant de la facture"
                    label="Montant"
                    onChange={handleChange}
                    value={invoice.amount}
                    error={errors.amount}
                />
                <Select
                    name="customer"
                    label="Client"
                    value={invoice.customer}
                    error={errors.customer}
                    onChange={handleChange}
                >
                    {customers.map(customer =>  <option key={customer.id} value={customer.id}>{customer.firstName} {customer.lastName}</option> )}
                  
                </Select>


                <Select
                    name="status"
                    label="Statut"
                    value={invoice.status}
                    error={errors.status}
                    onChange={handleChange}
                >
                    <option value="SENT">Envoyée</option>
                    <option value="PAID">Payée</option>
                    <option value="CANCELLED">Annulée</option>
                </Select>
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/invoices" className="btn btn-secondary">Retour aux factures</Link>
                </div>
            </form>
            
        </>
     );
}
 
export default InvoicePage;