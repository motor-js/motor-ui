import React from 'react'
import Button from '../Button'
import Spinner from '../Spinner'
import {
  SuggestionsItem,
  SuggestionsWrapper,
  SuggestionsList,
  SuggestionsItemLoad,
  SuggestionsItemTitle,
  SuggestionsItemValues,
} from './SearchTheme'

const Suggestions = ({
  searchResults,
  loadSearchTermsCallback,
  loadSearchItemsCallback,
  qCount,
  qGroupItemCount,
  selectCallback,
  loading,
  dropHeight,
  width,
  size,
}) => {
  // load more search results callback
  const loadSearchTerms = e => {
    e.preventDefault()
    e.stopPropagation()
    loadSearchTermsCallback()
  }

  // load more items within a dimension callback
  const loadItems = e => {
    e.stopPropagation()
    loadSearchItemsCallback()
  }

  // select search callback
  const select = r => selectCallback(r.qId)

  // Total number of dimensions returned in search
  const searchterms = searchResults.qTotalNumberOfGroups

  // Create suggestions list from search results
  let options = []
  const loadSuggestions = () => {
    options = searchResults.qSearchGroupArray.map((r, i) => {
      const numberOfItems = r.qItems[0].qTotalNumberOfMatches

      return (
        <SuggestionsItem
          data-testid={`suggestion-${i}`}
          key={i}
          onClick={() => select(r)}
        >
          <SuggestionsItemTitle
            data-testid={`dim-${i}`}
            size={size}
          >
            {r.qItems[0].qIdentifier}
          </SuggestionsItemTitle>
          <SuggestionsItemValues
            data-testid={`value-${i}`}
            size={size}
          >
            { r.qItems[0].qItemMatches.map(item => {
              if (item.qText.length > 30) {
                return `${(item.qText).substring(0, 20)}..`
              }

              return (item.qText)
            }).join(', ')}
            { numberOfItems > qGroupItemCount
              && (
              <SuggestionsItemLoad
                onClick={e => loadItems(e)}
                size={size}
              >
                Load more
              </SuggestionsItemLoad>
              )}
          </SuggestionsItemValues>
        </SuggestionsItem>
      )
    })
  }

  loadSuggestions()

  return (
    <SuggestionsWrapper width={width}>
      <SuggestionsList
        dropHeight={dropHeight}
      >
        {loading && <Spinner timeout={20000} />}
        {options}
        {options.length > 0 && searchterms > qCount
         && (
         <Button
           onClick={e => loadSearchTerms(e)}
           color="lightgrey"
           size="small"
           type="default"
         >
           Load more
         </Button>
         )}
      </SuggestionsList>
    </SuggestionsWrapper>
  )
}

export default Suggestions

