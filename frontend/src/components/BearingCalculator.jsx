import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calculator } from 'lucide-react'

const BearingCalculator = () => {
  const [formData, setFormData] = useState({
    alpha: 30,
    a1: 350,
    mm: 0.000018,
    k: 1.4,
    R_out: 0.0315,
    R_inner: 0.006,
    N: 24,
    nd: 1,
    R1: 0.012,
    D: 0.0005,
    Cc: 0.000025,
    alpha_corr: 1,
    pa: 100000,
    ps: 500000
  })

  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch("/api/calculate", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">AURA RotorCalc</h1>
          </div>
          <p className="text-lg text-gray-600">Калькулятор параметров газостатических подшипников</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Входные параметры */}
          <Card>
            <CardHeader>
              <CardTitle>Входные параметры</CardTitle>
              <CardDescription>Введите параметры подшипника для расчета</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="alpha">Alpha (°)</Label>
                    <Input
                      id="alpha"
                      name="alpha"
                      type="number"
                      step="0.1"
                      value={formData.alpha}
                      onChange={handleInputChange}
                    />
                    <p className="text-sm text-gray-500">Угол наклона</p>
                  </div>
                  <div>
                    <Label htmlFor="a1">a1</Label>
                    <Input
                      id="a1"
                      name="a1"
                      type="number"
                      step="0.1"
                      value={formData.a1}
                      onChange={handleInputChange}
                    />
                    <p className="text-sm text-gray-500">Параметр a1</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mm">mm</Label>
                    <Input
                      id="mm"
                      name="mm"
                      type="number"
                      step="0.000001"
                      value={formData.mm}
                      onChange={handleInputChange}
                    />
                    <p className="text-sm text-gray-500">Динамическая вязкость</p>
                  </div>
                  <div>
                    <Label htmlFor="k">k</Label>
                    <Input
                      id="k"
                      name="k"
                      type="number"
                      step="0.1"
                      value={formData.k}
                      onChange={handleInputChange}
                    />
                    <p className="text-sm text-gray-500">Показатель адиабаты</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="R_out">R_out (м)</Label>
                    <Input
                      id="R_out"
                      name="R_out"
                      type="number"
                      step="0.0001"
                      value={formData.R_out}
                      onChange={handleInputChange}
                    />
                    <p className="text-sm text-gray-500">Внешний радиус</p>
                  </div>
                  <div>
                    <Label htmlFor="R_inner">R_inner (м)</Label>
                    <Input
                      id="R_inner"
                      name="R_inner"
                      type="number"
                      step="0.0001"
                      value={formData.R_inner}
                      onChange={handleInputChange}
                    />
                    <p className="text-sm text-gray-500">Внутренний радиус</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="N">N</Label>
                    <Input
                      id="N"
                      name="N"
                      type="number"
                      value={formData.N}
                      onChange={handleInputChange}
                    />
                    <p className="text-sm text-gray-500">Количество отверстий</p>
                  </div>
                  <div>
                    <Label htmlFor="nd">nd</Label>
                    <Input
                      id="nd"
                      name="nd"
                      type="number"
                      value={formData.nd}
                      onChange={handleInputChange}
                    />
                    <p className="text-sm text-gray-500">Параметр nd</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="R1">R1 (м)</Label>
                    <Input
                      id="R1"
                      name="R1"
                      type="number"
                      step="0.0001"
                      value={formData.R1}
                      onChange={handleInputChange}
                    />
                    <p className="text-sm text-gray-500">Радиус R1</p>
                  </div>
                  <div>
                    <Label htmlFor="D">D (м)</Label>
                    <Input
                      id="D"
                      name="D"
                      type="number"
                      step="0.0001"
                      value={formData.D}
                      onChange={handleInputChange}
                    />
                    <p className="text-sm text-gray-500">Диаметр отверстия</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="Cc">Cc (м)</Label>
                    <Input
                      id="Cc"
                      name="Cc"
                      type="number"
                      step="0.000001"
                      value={formData.Cc}
                      onChange={handleInputChange}
                    />
                    <p className="text-sm text-gray-500">Радиальный зазор</p>
                  </div>
                  <div>
                    <Label htmlFor="alpha_corr">Alpha_corr</Label>
                    <Input
                      id="alpha_corr"
                      name="alpha_corr"
                      type="number"
                      step="0.1"
                      value={formData.alpha_corr}
                      onChange={handleInputChange}
                    />
                    <p className="text-sm text-gray-500">Коррекционный коэффициент</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pa">pa (Па)</Label>
                    <Input
                      id="pa"
                      name="pa"
                      type="number"
                      value={formData.pa}
                      onChange={handleInputChange}
                    />
                    <p className="text-sm text-gray-500">Атмосферное давление</p>
                  </div>
                  <div>
                    <Label htmlFor="ps">ps (Па)</Label>
                    <Input
                      id="ps"
                      name="ps"
                      type="number"
                      value={formData.ps}
                      onChange={handleInputChange}
                    />
                    <p className="text-sm text-gray-500">Давление подачи</p>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? 'Расчет...' : 'Рассчитать'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Результаты расчета */}
          <Card>
            <CardHeader>
              <CardTitle>Результаты расчета</CardTitle>
              <CardDescription>Результаты вычислений параметров подшипника</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                  <p className="text-red-800">Ошибка: {error}</p>
                </div>
              )}
              
              {results ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <h3 className="font-semibold text-green-800 mb-2">Результаты расчета:</h3>
                    <div className="space-y-2">
                      <p><strong>p_d:</strong> {results.p_d}</p>
                      <p><strong>Q (м³/ч):</strong> {results.Q}</p>
                      <p><strong>Осевая нагрузочная способность (Н):</strong> {results.AxialLoadCapacity_N}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Введите параметры и нажмите "Рассчитать" для получения результатов</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default BearingCalculator



