import z from "zod";

export const roadStatusSchema = z.object({
  edge_id: z.number().int(),
  // road_status memakai kode 0 aman, 1 terbatas, 2 putus, 3 belum diketahui.
  status: z.number().int().min(0).max(3),
  depth_cm: z.number().int().nonnegative().nullable(),
});

export const roadStatusListSchema = z.array(roadStatusSchema);

export type RoadStatus = z.infer<typeof roadStatusSchema>;
