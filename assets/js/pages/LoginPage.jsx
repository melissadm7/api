import React, { useState, useContext } from 'react'
import authAPI from '../services/authAPI'
import AuthContext from '../contexts/AuthContext'
import Field from '../components/forms/Field'
import { toast } from 'react-toastify'

const LoginPage = (props) => {

    const {setIsAuthenticated} = useContext(AuthContext)

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    })

    const [error, setError ] = useState("")

    const handleChange = (event) => {
        const value = event.currentTarget.value 
        const name = event.currentTarget.name

        // ... copie l'objet credentials et la virgule permet de dire avec modification (ajout ou remplacement)
        // si on laisse simplement name, il va venir écrire dans l'objet une prop name mais avec le crochet, il va prendre la valeur de name (ex: username)
        setCredentials({...credentials, [name]:value})

    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        //console.log(credentials)
        try{
            await authAPI.authenticate(credentials)
            setError("")
            setIsAuthenticated(true)
            toast.success("Vous êtes connecté")
            props.history.replace("/customers")
        }catch(error){
            setError("Aucun compte ne possède cette adresse e-mail ou les informations ne correspondent pas")
            toast.error("Une erreur est survenue")
        }
    }

    return ( 
        <>
            <div className="row">
                <div className="col-4 offset-4">
                    <h1>Connexion</h1>
                    <form onSubmit={handleSubmit}>
                        <Field 
                            label="Adresse Email"
                            name="username"
                            value={credentials.username}
                            onChange={handleChange}
                            placeholder="Adresse email de connexion"
                            error={error}
                        />
                        <Field
                            label="Mot de passe"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            type="password"
                            error=""
                        />
                        <div className="form-group">
                            <button className="btn btn-success">Connexion</button>
                        </div>
                    </form>

                </div>

            </div>

        </>
     );
}
 
export default LoginPage;