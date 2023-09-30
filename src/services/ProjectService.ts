import { err, ok, Result } from "neverthrow";
import { Project } from "@/models/ProjectModel";
import { AxiosError, AxiosResponse } from "axios";
import apiClient from "../apiClient/apiClient";
import {
  ApiPaginateResponse,
  ApiResponse,
} from "@/models/ResponseModel";

export type ProjectResponse = Result<
  ApiPaginateResponse<Project>,
  object
>;
export type ProjectCreateResponse = Result<
  ApiResponse<boolean>,
  object
>;

export interface ProjectService {
  get(): Promise<ProjectResponse>;

  create(project: Project): Promise<ProjectCreateResponse>;
}

// Project Service
export class ProjectRest implements ProjectService {
  async get(): Promise<ProjectResponse> {
    try {
      const response: AxiosResponse = await apiClient.get(
        "/api/client/projects?perPage=1000"
      );

      const res = response.data;

      return ok(await res);
    } catch (e: any) {
      if (e instanceof AxiosError) {
        if (e.response!.status === 403) {
          return err({ status: 403 });
        }

        return err(e.response!.data);
      }

      return err({ success: false, result: false });
    }
  }

  async create(project: Project): Promise<ProjectCreateResponse> {
    try {
      const response: AxiosResponse = await apiClient.post(
        "/api/client/projects",
        project
      );

      const res = response.data;

      return ok(await res);
    } catch (e: any) {
      if (e instanceof AxiosError) {
        if (e.response!.status === 403) {
          return err({ status: 403 });
        }

        return err(e.response!.data);
      }

      return err({ success: false, result: false });
    }
  }
}
