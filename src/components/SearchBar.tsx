import React from 'react'
import { InputGroup, Stack, InputLeftElement, Input } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'

interface Props {
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
  placeholder?: string
}

function SearchBar({ search, setSearch, placeholder }: Props) {
  return (
    <Stack pb="4">
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          value={search}
          placeholder={placeholder}
          onChange={e => setSearch(e.target.value)}
        />
      </InputGroup>
    </Stack>
  )
}

export default SearchBar
