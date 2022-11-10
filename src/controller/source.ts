import { Request, Response } from 'express'
import { ParsedQs } from 'qs'
import { Op } from 'sequelize'
import { SourceSchema } from '../schema'
import { SourceService } from '../service'
import { log, makeResponse, paginate } from '../utils'

export async function getAllSources(
  req: Request<
    Record<string, unknown>,
    unknown,
    Record<string, unknown>,
    SourceSchema.GetAllSourcesRequestType['query'] & ParsedQs
  >,
  res: Response,
) {
  try {
    const { pageNum, pageSize } = req.query
    const { sources, count, totalCount } = await SourceService.getAllSources(
      paginate(pageNum, pageSize),
    )

    return makeResponse(res, true, 'All sources fetched successfully', 200, {
      sources,
      count,
      totalCount,
      pageNum,
      pageSize,
      hasNext: (pageNum + 1) * pageSize < totalCount,
    })
  } catch (error: any) {
    log.error(error)
    return makeResponse(res, false, 'Internal Server Error', 500)
  }
}

export async function addSourceHandler(
  req: Request<
    Record<string, unknown>,
    unknown,
    SourceSchema.AddSourceRequestType['body']
  >,
  res: Response,
) {
  try {
    const attributes = req.body

    const query = { where: { [Op.or]: attributes } }
    const { count } = await SourceService.getAllSources(query)

    if (count !== 0)
      return makeResponse(res, false, 'Source is already exist', 400)

    const newSource = await SourceService.addSource(attributes)

    return makeResponse(res, true, 'Source added successfully', 201, newSource)
  } catch (error: any) {
    log.error(error)
    return makeResponse(res, false, 'Internal Server Error', 500)
  }
}
