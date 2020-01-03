import {
  h, createRef,
  DayHeader,
  ComponentContext,
  DateProfileGenerator,
  DateProfile,
  ViewProps,
  memoize,
  DaySeries,
  DayTableModel,
  ChunkContentCallbackArgs,
} from '@fullcalendar/core'
import TableView, { hasRigidRows } from './TableView'
import DayTable from './DayTable'


export default class DayTableView extends TableView {

  private buildDayTableModel = memoize(buildDayTableModel)
  private headerRef = createRef<DayHeader>()
  private tableRef = createRef<DayTable>()


  render(props: ViewProps, state: {}, context: ComponentContext) {
    let { options } = context
    let { dateProfile } = props
    let dayTableModel = this.buildDayTableModel(dateProfile, props.dateProfileGenerator)
    let { colWeekNumbersVisible, cellWeekNumbersVisible } = this.processOptions(options)

    return this.renderLayout(
      options.columnHeader &&
        <DayHeader
          ref={this.headerRef}
          dateProfile={dateProfile}
          dates={dayTableModel.headerDates}
          datesRepDistinctDays={dayTableModel.rowCnt === 1}
          renderIntro={this.renderHeadIntro}
        />,
      (contentArg: ChunkContentCallbackArgs) => (
        <DayTable
          ref={this.tableRef}
          dateProfile={dateProfile}
          dayTableModel={dayTableModel}
          businessHours={props.businessHours}
          dateSelection={props.dateSelection}
          eventStore={props.eventStore}
          eventUiBases={props.eventUiBases}
          eventSelection={props.eventSelection}
          eventDrag={props.eventDrag}
          eventResize={props.eventResize}
          isRigid={hasRigidRows(context.options)}
          nextDayThreshold={context.nextDayThreshold}
          colGroupNode={contentArg.colGroupNode}
          renderNumberIntro={this.renderNumberIntro}
          renderBgIntro={this.renderBgIntro}
          renderIntro={this.renderIntro}
          colWeekNumbersVisible={colWeekNumbersVisible}
          cellWeekNumbersVisible={cellWeekNumbersVisible}
        />
      )
    )
  }

}


export function buildDayTableModel(dateProfile: DateProfile, dateProfileGenerator: DateProfileGenerator) {
  let daySeries = new DaySeries(dateProfile.renderRange, dateProfileGenerator)

  return new DayTableModel(
    daySeries,
    /year|month|week/.test(dateProfile.currentRangeUnit)
  )
}
