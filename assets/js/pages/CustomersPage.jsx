import React, { useEffect, useState } from 'react'
import Pagination from "../components/Pagination"
import customersAPI from '../services/customersAPI'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const CustomersPage = (props) => {

    const [customers, setCustomers] = useState([])
    // pour la pagination
    const [currentPage, setCurrentPage] = useState(1)

    // filtre 
    const [search, setSearch] = useState("")

    const fetchCustomers = async () => {
        try{
            const data = await customersAPI.findAll()
            setCustomers(data)
        }catch(error){
           toast.error("Impossible de charger les clients")
        }
    }

    useEffect(()=>{
        fetchCustomers()
    }, []);

    const handleDelete = async (id) => {
        const orignalCustomers = [...customers]

        // optimiste
        setCustomers(customers.filter(customer => customer.id !== id))


        // pessimiste, si cela n'a pas fonctionné, on réintègre la copie avec orignalCustomers
        try {
            await customersAPI.delete(id)
            toast.warning("Le client a bien été supprimé")
        }catch(error){
            setCustomers(orignalCustomers)
            toast.error("La suppression du client n'a pas pu fonctionner")
        }

    }

    const handleSearch = event => {
        const value = event.currentTarget.value
        setSearch(value)
        setCurrentPage(1)
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const filteredCustomers = customers.filter(c => 
            c.firstName.toLowerCase().includes(search.toLowerCase()) ||
            c.lastName.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
        )



    const itemsPerPage = 10

    const paginatedCustomers = Pagination.getData(filteredCustomers, currentPage, itemsPerPage)
  

    return ( 
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h1>Liste des clients</h1>
                <Link className="btn btn-primary mb-3" to="/customers/new">Créer un client</Link>
            </div>
            {/* filtre */}
            <div className="form-group">
                <input type="text" className="form-control" placeholder="Rechercher..." onChange={handleSearch} value={search}/>
            </div>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Client</th>
                        <th>Email</th>
                        <th>Entreprise</th>
                        <th>Factures</th>
                        <th className="text-center">Montant total</th>
                        <th className="text-center">Montant restant</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedCustomers.map(customer => (
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>{customer.firstName} {customer.lastName}</td>
                            <td>{customer.email}</td>
                            <td>{customer.company}</td>
                            <td className="text-center">
                                <span className="badge badge-primary">
                                    {customer.invoices.length}
                                </span>
                            </td>
                            <td className="text-center">{customer.totalAmount.toLocaleString()}€</td>
                            <td className="text-center">{customer.unpaidAmount.toLocaleString()}€</td>
                            <td>
                            <Link className="btn btn-sm btn-success mb-2" to={`/customers/${customer.id}`}>Editer</Link>
                                <button
                                    disabled={customer.invoices.length > 0}
                                    onClick={()=> handleDelete(customer.id)}
                                    className="btn btn-sm btn-danger">
                                        Supprimer
                                        </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            { itemsPerPage < filteredCustomers.length &&
                <Pagination 
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    length={filteredCustomers.length}
                    onPageChanged={handlePageChange}
                />

            }
        </>
     );
}
 
export default CustomersPage;