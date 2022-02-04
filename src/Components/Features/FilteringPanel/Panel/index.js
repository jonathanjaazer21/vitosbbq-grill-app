import React from "react"
import { Flex, Grid } from "../Styled"
import { ChipValue, PanelChips, PanelContainer } from "./styles"

function Panel({
  date,
  timeStart,
  timeEnd,
  chips = [],
  backgroundColor = "#eee",
}) {
  return (
    <Grid padding="0.1rem">
      <PanelContainer backgroundColor={backgroundColor}>
        <Grid>
          <b>Date </b>
          <div>{date}</div>
          <Grid columns={2} responsive={false}>
            <Grid>
              <b>Time start </b>
              <div>{timeStart}</div>
            </Grid>
            <Grid>
              <b>Time end </b>
              <div>{timeEnd} </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid padding="0.2rem">
          <Flex>
            {chips.map((chip) => {
              const _chips = chip.split(":")
              const _desc = _chips[0]
              const _value = _chips[1]
              return (
                <PanelChips>
                  {_desc}:<ChipValue>{_value}</ChipValue>
                </PanelChips>
              )
            })}
          </Flex>
        </Grid>
      </PanelContainer>
    </Grid>
  )
}

export default Panel
