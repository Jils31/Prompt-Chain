import api from '../api/client'

export const runChain = async (chainId, inputValues = { topic: '' }) => {
    const res = await api.post(`/run-chain/${chainId}`, {
        chainId,
        inputValues
    })
    return res.data
}

export const getExecutionResult = async (executionId) => {
    const res = await api.get(`/execute/${executionId}`)
    return res.data
}