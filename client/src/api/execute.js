import api from '../api/client'

export const runChain = async (chainId) => {
    const res = await api.post(`/execute/${chainId}`)
    return res.data
}

export const getExecutionResult = async (executionId) => {
    const res = await api.get(`/execute/${executionId}`)
    return res.data
}