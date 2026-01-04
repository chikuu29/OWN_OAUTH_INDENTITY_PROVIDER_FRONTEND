import { Accordion, HStack } from "@chakra-ui/react"
import * as React from "react"
import { FaArrowDownWideShort } from "react-icons/fa6"


export const AccordionItemTrigger = React.forwardRef<
    HTMLButtonElement,
    Accordion.ItemTriggerProps
>(function AccordionItemTrigger(props, ref) {
    const { children, ...rest } = props
    return (
        <Accordion.ItemTrigger {...rest} ref={ref} cursor="pointer" boxShadow={'md'} mb={2} pe={2} borderRadius="2xl"
            border="1px solid"
            borderColor="blue.100"
            _dark={{
                bgGradient: "linear(to-br, blue.950, gray.900)",
                borderColor: "blue.900",
            }}>
            <HStack gap="4" flex="1" textAlign="start" width="full" >
                {children}
            </HStack>
            <Accordion.ItemIndicator>
                <FaArrowDownWideShort />
            </Accordion.ItemIndicator>
        </Accordion.ItemTrigger>
    )
})

export const AccordionRoot = Accordion.Root
export const AccordionItem = Accordion.Item
export const AccordionItemContent = Accordion.ItemContent
