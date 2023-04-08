import dynamic from 'next/dynamic'


const ComponentFactory = ({ data, handleChange, value, errors }) => {
	const Label = dynamic(import('reactstrap/lib/Label'), { ssr: true })
	const Input = dynamic(import('reactstrap/lib/Input'), { ssr: true })
	const Badge = dynamic(import('reactstrap/lib/Badge'), { ssr: true })
	const FormGroup = dynamic(import('reactstrap/lib/FormGroup'), { ssr: true })
	const FormFeedback = dynamic(import('reactstrap/lib/FormFeedback'), { ssr: true })
	switch (data.type) {
		case 'text':
		case 'password':
		case 'email':
			// Type password doesnt works with pattern
			return <FormGroup>
				<Label for={data.name}>{data.label}</Label>
				<Input
					invalid={errors[data.name]}
					defaultValue={value} onBlur={(e) => handleChange(e, data.conditions?.validations)} name={data.name}
					type={data.type}
					autoComplete='new-password'
					// pattern={data.type !== 'password' ? data.regex : ''}
					placeholder={data.label}
					required={data.required}
				/>
				<FormFeedback>
					Las contraseñas no coinciden
				</FormFeedback>
			</FormGroup>
		case 'checkbox':
			return <FormGroup check>
				<Input name={data.name} id={data.name} type={data.type} required={data.required} />
				<Label check for={data.name}>{data.label}</Label>
			</FormGroup>
		case 'button':
			// Fix data.type to submit
			return <FormGroup>
				<Input
					name={data.name}
					type={'submit'}
					value={data.label}
					disabled={Object.values(errors).includes(true)}
				/>
			</FormGroup>
		case 'link':
			return <FormGroup><Badge href={data.target}>{data.text}</Badge></FormGroup>
		case 'select':
			return <FormGroup>
				<Label for={data.name}>{data.label}</Label>
				<Input
					invalid={errors[data.name]}
					value={value}
					onChange={(e) => handleChange(e, data.conditions?.validations)}
					name={data.name} type={data.type}
					placeholder={data.label}
					required={data.required}
				>
					{data.options.map((option, index) => <option key={index} value={option.value}>{option.label}</option>)}
				</Input>
			</FormGroup>
		default:
			return <FormGroup><Label>{data.label}</Label></FormGroup>
	}
}

export default ComponentFactory;