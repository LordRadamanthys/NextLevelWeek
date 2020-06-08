import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import './styles.css'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import logo from '../../assets/logo.svg'
import api from '../../services/api'
import axios from 'axios'
import Dropzone from '../../components/Dropzone/index'

interface Item {
    id: number,
    title: string,
    image_url: string

}

interface IBGEResponse {
    sigla: string
}


interface IBGECityResponse {
    nome: string
}

const CreatePoint = () => {
    const [items, setItems] = useState<Item[]>([])
    const [UFs, setUfs] = useState<string[]>([])
    const [citys, setCitys] = useState<string[]>([])
    const [selectedUF, setSelecteUF] = useState("0")
    const [selectedCity, setSelecteCity] = useState("0")
    const [selectedPosition, setSelectPosition] = useState<[number, number]>([0, 0])
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])
    const [selectedItems, setSelectedItems] = useState<number[]>([])
    const [selectedFile, setSelectedFile] = useState<File>()
    const history = useHistory()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        whatsapp: "",
    }
    )


    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data)
        })
    }, [])/*se for passado um parametro ela vai esxecutar sempre que a variavel for alterada*/


    useEffect(() => {
        axios.get<IBGEResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla)
            setUfs(ufInitials)
        })
    }, [])


    useEffect(() => {
        if (selectedUF === '0') return
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`).then(response => {
            const citys = response.data.map(city => city.nome)
            setCitys(citys)
        })
    }, [selectedUF])


    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords

            setInitialPosition([latitude, longitude])
        })
    }, [])

    function handleSelectionUf(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value
        setSelecteUF(uf)
    }

    function handleSelectionCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value
        setSelecteCity(city)
    }

    function handleMapClick(event: LeafletMouseEvent) {
        setSelectPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: value })
    }


    function handleSelectItem(id: number) {
        const alredySelected = selectedItems.findIndex(item => item === id)
        if (alredySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id)
            setSelectedItems(filteredItems)
        } else {
            setSelectedItems([...selectedItems, id])
        }

    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()


        const { name, email, whatsapp } = formData
        const uf = selectedUF
        const city = selectedCity
        const [latitude, longitude] = selectedPosition
        const items = selectedItems

        const data = new FormData()

        data.append('name', name)
        data.append('email', email)
        data.append('whatsapp', whatsapp)
        data.append('uf', uf)
        data.append('city', city)
        data.append('latitude', String(latitude))
        data.append('longitude', String(longitude))
        data.append('items', items.join(','))
        if (selectedFile)
            data.append('image', selectedFile)

        await api.post('points', data).then(response => {
           alert("Ponto Cadastrado")
        }).catch(error => {
            console.log(error)
        })

        history.push('/')
    }

    return (
    <>
            <div id="page-create-point">
                <header>
                    <img src={logo} alt="Ecoleta" />
                    <Link to="/" >
                        <FiArrowLeft />
                    voltar home
                </Link>
                </header>

                <form onSubmit={handleSubmit}>
                    <h1>Cadastro do <br /> ponto de coleta</h1>
                    <Dropzone onFileUploaded={setSelectedFile} />

                    <fieldset>
                        <legend>
                            <h2>Dados</h2>
                        </legend>

                        <div className="field">
                            <label htmlFor="name">Nome da entidade</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                onChange={handleInputChange}
                            />
                        </div>


                        <div className="field">
                            <label htmlFor="email">E-mail da entidade</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>


                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp da entidade</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                            />
                        </div>

                    </fieldset>

                    <fieldset>
                        <legend>
                            <h2>Endereço</h2>
                            <span>Selecione um ou mais itens abaixo</span>
                        </legend>
                        <Map center={[-23.5109745, -46.4417299]} zoom={15} onClick={handleMapClick}>
                            <TileLayer
                                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker
                                position={selectedPosition}
                            />
                        </Map>

                        <div className="field-group">
                            <div className="field">
                                <label htmlFor="uf">Estado (UF)</label>
                                <select name="uf" id="uf" onChange={handleSelectionUf} value={selectedUF} >
                                    <option value="0">Selecione</option>
                                    {UFs.map(uf => (
                                        <option key={uf} value={uf}>{uf}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="field">
                                <label htmlFor="city">Cidade</label>
                                <select name="city" id="city" value={selectedCity} onChange={handleSelectionCity}>
                                    <option value="0">Selecione uma cidade</option>
                                    {citys.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>

                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>
                            <h2>Itens de coleta</h2>
                        </legend>
                        <ul className="items-grid">
                            {items.map(item => (
                                <li
                                    key={item.id}
                                    onClick={() => handleSelectItem(item.id)}
                                    className={selectedItems.includes(item.id) ? 'selected' : ''}
                                >
                                    <img src={item.image_url} alt={item.title} />
                                    <span>{item.title}</span>
                                </li>
                            ))}

                        </ul>
                    </fieldset>
                    <button type="submit">Cadastra pontos de coleta</button>
                </form>
            </div>
        </>
    )
}


export default CreatePoint