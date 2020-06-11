import React, {useState, useEffect} from 'react'
import invoicesAPI from '../services/invoicesAPI'
import Pagination from '../components/Pagination'
import moment from "moment"
import {Link} from 'react-router-dom'
import { toast } from 'react-toastify'

 /* object js pour transformer le statut */
 const STATUS_CLASSES = {
    PAID: "success",
    SENT: "primary",
    CANCELLED: "danger"
}

const STATUS_LABELS = {
    PAID : "Payée",
    SENT : "Envoyée",
    CANCELLED: "Annulée"
}


const InvoicesPage = (props) => {

    const [invoices, setInvoices] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState("")
    const itemsPerPage = 10

    // Récupération des invoices auprès de l'API
    const fetchInvoice = async () => {
        try{
            const data = await invoicesAPI.findAll()
            setInvoices(data)
        }catch(error){
           toast.error("Erreur lors du chargement des factures")
        }
    }

    useEffect(()=>{
        fetchInvoice()
    },[])

    // gestion du changement de page
     const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    // gestion de la recherche 
    const handleSearch = event => {
        const value = event.currentTarget.value
        setSearch(value)
        setCurrentPage(1)
    }

    const filteredInvoices = invoices.filter(i =>
      i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||  
      i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||  
      i.amount.toString().includes(search.toLowerCase()) ||
      STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
    )

    // gestion de la suppression
    const handleDelete = async (id) => {
        const orignalInvoices = [...invoices]
        // optimiste
        setInvoices(invoices.filter(invoice => invoice.id !== id))

        // pessimiste, si cela n'a pas fonctionné, on réintègre la copie avec orignalCustomers
        try {
            await invoicesAPI.delete(id)
            toast.warning("La facture a bien été supprimée")
        }catch(error){
            toast.error("Une erreur est survenue")
            setInvoices(orignalInvoices)
            // notif a faire
        }
    }

    const formatDate = (str) => moment(str).format('DD/MM/YYYY')

    // pagination des données
    const paginatedInvoices = Pagination.getData(filteredInvoices, currentPage, itemsPerPage)

    return ( 
        <>
             <div className="d-flex justify-content-between align-items-center">
                <h1>Liste des factures</h1>
                <Link className="btn btn-primary mb-3" to="/invoices/new">Créer une facture</Link>
            </div>
            
            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher ..." />    
            </div> 
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th className="text-center">Numéro</th>
                        <th>Client</th>
                        <th className="text-center">Date d'envoi</th>
                        <th className="text-center">Statut</th>
                        <th className="text-center">Montant</th>
                        <th className="text-center"></th>
                    </tr>
                </thead>
                <tbody>
                    {
                       paginatedInvoices.map(invoice =>(
                           <tr key={invoice.id}>
                               <td className="text-center">{invoice.id}</td>
                                <td className="text-center">{invoice.customer.firstName} {invoice.customer.lastName}</td>
                                <td className="text-center">{formatDate(invoice.sentAt)}</td>
                               <td className="text-center">
                                   <span className={"badge badge-"+ STATUS_CLASSES[invoice.status]}>
                                       {STATUS_LABELS[invoice.status]}
                                   </span>
                               </td>
                                <td className="text-center">{invoice.amount.toLocaleString()}€</td>
                               <td className="text-center">
                                    <Link className="btn btn-sm btn-success mx-3" to={`/invoices/${invoice.id}`}>Editer</Link>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(invoice.id)}>Supprimer</button>
                               </td>
                           </tr>
                       )) 
                    }
                </tbody>
            </table>
            { itemsPerPage < filteredInvoices.length && 
            <Pagination 
                currentPage={currentPage} 
                itemsPerPage={itemsPerPage}
                length={filteredInvoices.length}
                onPageChanged={handlePageChange}
            />
            }
        </>
     );
}
 
export default InvoicesPage;