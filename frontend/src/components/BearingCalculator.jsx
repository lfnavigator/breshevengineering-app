import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Loader2, Calculator } from 'lucide-react'

const BearingCalculator = () => {
  const [formData, setFormData] = useState({
    alpha: 30,
    a1: 350,
    mm: 1.8e-5,
    k: 1.4,
    R_out: 31.5e-3,
    R_inner: 6e-3,
    N: 24,
    nd: 1,
    R1: 12e-3,
    D: 0.5e-3,
    Cc: 25e-6,
    alpha_corr: 1,
    pa: 1e5,
    ps: 5e5
  })

  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleInputChange = (name, value) => {
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

    try {      const response = await fetch(\"/api/calculate\", {        method: 'POST',
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

  const inputFields = [
    { name: 'alpha', label: 'Alpha (°)', description: 'Угол наклона' },
    { name: 'a1', label: 'a1', description: 'Параметр a1' },
    { name: 'mm', label: 'mm', description: 'Динамическая вязкость', step: '1e-6' },
    { name: 'k', label: 'k', description: 'Показатель адиабаты', step: '0.1' },
    { name: 'R_out', label: 'R_out (м)', description: 'Внешний радиус', step: '1e-3' },
    { name: 'R_inner', label: 'R_inner (м)', description: 'Внутренний радиус', step: '1e-3' },
    { name: 'N', label: 'N', description: 'Количество отверстий' },
    { name: 'nd', label: 'nd', description: 'Параметр nd' },
    { name: 'R1', label: 'R1 (м)', description: 'Радиус R1', step: '1e-3' },
    { name: 'D', label: 'D (м)', description: 'Диаметр отверстия', step: '1e-4' },
    { name: 'Cc', label: 'Cc (м)', description: 'Радиальный зазор', step: '1e-6' },
    { name: 'alpha_corr', label: 'Alpha_corr', description: 'Коррекционный коэффициент', step: '0.1' },
    { name: 'pa', label: 'pa (Па)', description: 'Атмосферное давление' },
    { name: 'ps', label: 'ps (Па)', description: 'Давление подачи' }
  ]

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
          <Calculator className="h-8 w-8" />
          AURA RotorCalc
        </h1>
        <p className="text-muted-foreground">Калькулятор параметров газостатических подшипников</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Форма ввода */}
        <Card>
          <CardHeader>
            <CardTitle>Входные параметры</CardTitle>
            <CardDescription>
              Введите параметры подшипника для расчета
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inputFields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name} className="text-sm font-medium">
                      {field.label}
                    </Label>
                    <Input
                      id={field.name}
                      type="number"
                      step={field.step || 'any'}
                      value={formData[field.name]}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">{field.description}</p>
                  </div>
                ))}
              </div>
              
              <Button 
                type="submit" 
                className="w-full mt-6" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Вычисление...
                  </>
                ) : (
                  'Рассчитать'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Результаты */}
        <Card>
          <CardHeader>
            <CardTitle>Результаты расчета</CardTitle>
            <CardDescription>
              Результаты вычислений параметров подшипника
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
                <p className="text-destructive font-medium">Ошибка:</p>
                <p className="text-destructive">{error}</p>
              </div>
            )}

            {results && (
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <h3 className="font-semibold text-primary mb-2">p_d</h3>
                    <p className="text-2xl font-bold">{results.p_d}</p>
                    <p className="text-sm text-muted-foreground">Безразмерное давление</p>
                  </div>
                  
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <h3 className="font-semibold text-primary mb-2">Q</h3>
                    <p className="text-2xl font-bold">{results.Q}</p>
                    <p className="text-sm text-muted-foreground">Расход газа</p>
                  </div>
                  
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <h3 className="font-semibold text-primary mb-2">Осевая нагрузочная способность</h3>
                    <p className="text-2xl font-bold">{results.AxialLoadCapacity_N} Н</p>
                    <p className="text-sm text-muted-foreground">Максимальная осевая нагрузка</p>
                  </div>
                </div>
              </div>
            )}

            {!results && !error && !loading && (
              <div className="text-center py-8">
                <Calculator className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Введите параметры и нажмите "Рассчитать" для получения результатов
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default BearingCalculator

