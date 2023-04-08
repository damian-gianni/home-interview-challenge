import dynamic from 'next/dynamic'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

// Layout
const Container = dynamic(import('reactstrap/lib/Container'), { ssr: true })
const Row = dynamic(import('reactstrap/lib/Row'), { ssr: true })
const Col = dynamic(import('reactstrap/lib/Col'), { ssr: true })

const Label = dynamic(import('reactstrap/lib/Label'), { ssr: true })
const ComponentFactory = dynamic(import('../common/ComponentFactory'), { ssr: true })

const Form = dynamic(import('reactstrap/lib/Form'), { ssr: true })

const Page = ({ data, path }) => {
  const [values, setValues] = useState({})
  const [errors, setErrors] = useState({})

  const handleInput = async (e, validations = []) => {
    const obj = { [e.target.name]: e.target.value }
    setValues({ ...values, ...obj })
    const validationOK = await checkValidations(validations, e.target.name)
    setErrors({ ...errors, [e.target.name]: !validationOK })
  }

  const checkValidations = (validations, fieldName) => {
    let resultValidation = [];
    validations.map(rProp => {
      switch (rProp.comparision) {
        case 'same':
          resultValidation.push(values[fieldName] === values[rProp.input])
          break;
        case 'includes':
          resultValidation.push(rProp.values.includes(values[rProp.input]))
          break;
        case 'not_includes':
          resultValidation.push(!rProp.values.includes(values[rProp.input]))
          break;
      }
    })

    return !resultValidation.includes(false);
  }

  const submitForm = (e) => {
    Object.values(errors).includes(true) && e.preventDefault()
  }

  return (
    <Container fluid className="bg-light border w-50 p-3">
      <Row className="align-items-center">
        <Col xs="12">
          <Label>{data?.title}</Label>
        </Col>
      </Row>
      {data.inputs &&
        <Form action={path} method="POST" onSubmit={submitForm}>
          {data.inputs.map((field, index) => {
            const render = field.conditions?.render ? checkValidations(field.conditions.render, field.name) : true;
            return (
              render && <Row key={index}>
                <Col xs="12">
                  <ComponentFactory
                    key={field.name}
                    data={field}
                    handleChange={handleInput}
                    value={values[field.name]}
                    errors={errors}
                  />
                </Col>
              </Row>)
          }
          )}
        </Form>
      }
    </Container>
  )
}

// This gets called on every request
export async function getServerSideProps({ res, resolvedUrl }) {
  try {

    // Imnplement cache
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=10, stale-while-revalidate=59'
    )

    // Fetch data from external API
    const response = await fetch(`http://localhost:3000/configuration${resolvedUrl}`)
    const data = await response.json()
    // Pass data to the page via props
    return { props: { data, path: resolvedUrl } }
  } catch (error) {
    return {
      notFound: true
    }
  }
}

export default Page