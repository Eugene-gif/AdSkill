import { Err, err, Ok, ok, Result } from "neverthrow";
import { AxiosError, AxiosResponse } from "axios";
import apiClient from "@/apiClient/apiClient";
import { ApiResponse } from "@/models/ResponseModel";
import { SingleIDObject } from "@/models/SingleIDObject";
import { AttachmentWithType } from "@/models/CommonModel";

export type ImageData = Result<
  ApiResponse<boolean | SingleIDObject>,
  object
>;

export type UploadData = Result<
  ApiResponse<AttachmentWithType>,
  object
>;

export type AttachmentListData = Result<string, object>;

export interface ImageService {
  upload(image: File): Promise<UploadData>;

  uploadAvatar(image: File): Promise<UploadData>;

  deleteAvatar(avatarID: string): Promise<ImageData>;

  deleteAttachment(attachmentID: string): Promise<ImageData>;

  multipleUpload(
    files: Array<File>
  ): Promise<Ok<Array<string>, never>>;

  multipleDownload(
    attachmentArray: string[]
  ): Promise<AttachmentListData>;
}

export class ImageController implements ImageService {
  async upload(image: File): Promise<UploadData> {
    try {
      const imageData = new FormData();
      imageData.append("file", image);

      let response: AxiosResponse = await apiClient.post(
        import.meta.env.VITE_API_URL + "/api/file/attachment/upload",
        imageData
      );

      const res = response.data;

      return ok(await res);
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response!.status === 403) {
          return err({ status: 403 });
        }

        return err(e.response!.data);
      }

      return err({ success: false, result: false });
    }
  }

  async uploadAvatar(image: File): Promise<UploadData> {
    try {
      const imageData = new FormData();
      imageData.append("file", image);

      let response: AxiosResponse = await apiClient.post(
        import.meta.env.VITE_API_URL + "/api/file/avatar/upload",
        imageData
      );

      const res = response.data;

      return ok(await res);
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response!.status === 403) {
          return err({ status: 403 });
        }

        return err(e.response!.data);
      }

      return err({ success: false, result: false });
    }
  }

  async deleteAvatar(avatarID: string): Promise<ImageData> {
    try {
      let response: AxiosResponse = await apiClient.delete(
        import.meta.env.VITE_API_URL + `/api/file/avatar/${avatarID}`
      );

      const res = response.data;

      return ok(await res);
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response!.status === 403) {
          return err({ status: 403 });
        }

        return err(e.response!.data);
      }

      return err({ success: false, result: false });
    }
  }

  async deleteAttachment(attachmentID: string): Promise<ImageData> {
    try {
      let response: AxiosResponse = await apiClient.delete(
        import.meta.env.VITE_API_URL +
          `/api/file/avatar/${attachmentID}`
      );

      const res = response.data;

      return ok(await res);
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response!.status === 403) {
          return err({ status: 403 });
        }

        return err(e.response!.data);
      }

      return err({ success: false, result: false });
    }
  }

  async multipleUpload(
    files: Array<File>
  ): Promise<Ok<Array<string>, never>> {
    try {
      let arrayIDs: Array<string> = [];

      const responses = files.map((file) => {
        const imageData = new FormData();
        imageData.append("file", file);

        return apiClient.post(
          import.meta.env.VITE_API_URL +
            "/api/file/attachment/upload",
          imageData
        );
      });

      await Promise.all(responses).then((responses) =>
        responses.forEach((response) => {
          arrayIDs.push(response.data.result);
        })
      );

      return ok(arrayIDs);
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response!.status === 403) {
          throw err({ status: 403 });
        }

        throw err(e.response!.data);
      }

      throw err({ success: false, result: false });
    }
  }

  async multipleDownload(
    attachmentArray: string[]
  ): Promise<AttachmentListData> {
    try {
      const response: AxiosResponse = await apiClient.post(
        "/api/file/attachment/download",
        {
          ids: attachmentArray,
        },
        { responseType: "arraybuffer" }
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
