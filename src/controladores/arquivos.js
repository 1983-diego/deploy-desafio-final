const aws = require("aws-sdk")
const endpoint = new aws.Endpoint(process.env.ENDPOINT_S3)
const {v4: uuidv4} = require("uuid")

const s3 = new aws.S3({
    endpoint,
    credentials: {
        accessKeyId: process.env.KEY_ID,
        secretAccessKey: process.env.APP_KEY
    }
})

const uploadImagem = async (req, res) => {
    const {file} = req

    try {
        if(!file){
            return res.status(400).json({mensagem: "É necessário fazer a inserção da imagem para upload"})
        }

        const arquivo = await s3.upload({
            Bucket: process.env.BUCKET,
            Key: `imagens/${uuidv4()}${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype
        }).promise()

        return res.status(201).json(arquivo.Location)
    } catch (error) {
        return res.status(500).json({mensagem: error.message})
    }

}

const listarImagens = async (req, res) => {

    try {
        const arquivos = await s3.listObjects({
            Bucket: process.env.BUCKET
        }).promise()

        const files = arquivos.Contents.map((file) => {
            return {
                url: `http://${process.env.BUCKET}.${process.env.ENDPOINT_S3}/${file.Key}`
            }
        })
    
        return res.status(200).json(files)
    } catch (error) {
        return res.status(500).json({mensagem: error.message})
    }

    
}

module.exports = {
    uploadImagem,
    listarImagens
}