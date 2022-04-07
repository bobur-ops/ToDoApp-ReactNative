import React, { useCallback, useState, useEffect } from 'react'
import {
	VStack,
	useColorModeValue,
	Fab,
	Icon,
	useColorMode,
	Text,
	Heading,
} from 'native-base'
import { AntDesign } from '@expo/vector-icons'
import AnimatedColorBox from '../components/animated-color-box'
import TaskList from '../components/task-list'
import shortid from 'shortid'
import Masthead from '../components/masthead'
import NavBar from '../components/navbar'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface Task {
	id: any
	subject: string
	done: boolean
}

export default function MainScreen() {
	const [data, setData] = useState<Task[]>([])
	const [editingItemId, setEditingItemId] = useState<string | null>(null)

	const getTasks = async () => {
		try {
			const value = await AsyncStorage.getItem('tasks')
			if (value !== null) {
				// value previously stored
				setData(JSON.parse(value))
			}
		} catch (e) {
			// error reading value
			console.log(e)
		}
	}

	useEffect(() => {
		getTasks()
	}, [])

	const handleToggleTaskItem = useCallback((item) => {
		setData((prevData) => {
			const newData = [...prevData]
			const index = prevData.indexOf(item)
			newData[index] = {
				...item,
				done: !item.done,
			}
			return newData
		})
	}, [])
	const handleChangeTaskItemSubject = useCallback((item, newSubject) => {
		setData((prevData) => {
			const newData = [...prevData]
			const index = prevData.indexOf(item)
			newData[index] = {
				...item,
				subject: newSubject,
			}
			return newData
		})
	}, [])
	const handleFinishEditingTaskItem = useCallback(async (_item) => {
		setEditingItemId(null)
	}, [])
	const handlePressTaskItem = useCallback((item) => {
		setEditingItemId(item.id)
	}, [])
	const handleRemoveItem = useCallback((item) => {
		setData((prevData) => {
			const newData = prevData.filter((i) => i !== item)
			return newData
		})
	}, [])

	const handleAddTask = async () => {
		try {
			const id = shortid.generate()
			setData([
				{
					id,
					subject: '',
					done: false,
				},
				...data,
			])
			setEditingItemId(id)
			await AsyncStorage.setItem('tasks', JSON.stringify(data))
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<AnimatedColorBox
			flex={1}
			bg={useColorModeValue('warmGray.50', 'primary.900')}
			w='full'
		>
			<Masthead
				title="What's up, Friend!"
				image={require('../assets/masthead.png')}
			>
				<NavBar />
			</Masthead>
			<VStack
				flex={1}
				space={1}
				bg={useColorModeValue('warmGray.50', 'primary.900')}
				mt='-20px'
				borderTopLeftRadius='20px'
				borderTopRightRadius='20px'
				pt='20px'
			>
				{data.length ? (
					<TaskList
						data={data}
						onToggleItem={handleToggleTaskItem}
						onChangeSubject={handleChangeTaskItemSubject}
						onFinishEditing={handleFinishEditingTaskItem}
						onPressLabel={handlePressTaskItem}
						onRemoveItem={handleRemoveItem}
						editingItemId={editingItemId}
					/>
				) : (
					<Heading
						color={useColorModeValue('blue.800', 'darkBlue.700')}
						p={6}
						size='xl'
					>
						No tasks yet
					</Heading>
				)}
			</VStack>
			<Fab
				position='absolute'
				renderInPortal={false}
				size='sm'
				icon={<Icon color='white' as={<AntDesign name='plus' />} size='md' />}
				colorScheme={useColorModeValue('blue', 'darkBlue')}
				bg={useColorModeValue('blue.500', 'blue.400')}
				onPress={handleAddTask}
			/>
		</AnimatedColorBox>
	)
}
